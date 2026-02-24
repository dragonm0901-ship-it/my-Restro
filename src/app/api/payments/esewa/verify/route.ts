import { NextResponse } from 'next/server';
import crypto from 'crypto-js';
import { createClient } from '@supabase/supabase-js';

const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";

export async function GET(req: Request) {
    // Initialize Supabase Admin Client to bypass RLS for server-side updates
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! // Ensure this is set in .env.local
    );

    try {
        const { searchParams } = new URL(req.url);
        const data = searchParams.get('data');

        if (!data) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?status=invalid_request`);
        }

        // eSewa sends a base64 encoded JSON string in the 'data' query parameter
        const decodedData = atob(data);
        const eSewaPayload = JSON.parse(decodedData);

        const { transaction_code, status, total_amount, transaction_uuid, signed_field_names, signature } = eSewaPayload;

        // 1. Verify the signature
        // The message string needs to follow exactly the fields defined in signed_field_names
        const fields = signed_field_names.split(',');
        let messageString = '';
        fields.forEach((field: string, index: number) => {
            messageString += `${field}=${eSewaPayload[field]}`;
            if (index < fields.length - 1) {
                messageString += ',';
            }
        });

        const hash = crypto.HmacSHA256(messageString, ESEWA_SECRET_KEY);
        const generatedSignature = crypto.enc.Base64.stringify(hash);

        if (signature !== generatedSignature) {
            console.error("eSewa Signature mismatch. Possible fraud attempt.");
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?status=verification_failed`);
        }

        // 2. Parse the transaction_uuid to get our internal references
        // We formatted it as `${restaurantId}-${planId}-${timestamp}`
        const [restaurantId, planId] = transaction_uuid.split('-');

        if (status === 'COMPLETE') {
            // 3. Log the successful transaction
            await supabase.from('payment_transactions').insert({
                restaurant_id: restaurantId,
                plan_id: planId,
                amount_npr: parseFloat(total_amount.replace(/,/g, '')), // Parse amount safely
                payment_method: 'esewa',
                status: 'completed',
                transaction_id: transaction_code,
                reference_id: transaction_uuid,
                gateway_response: eSewaPayload
            });

            // 4. Update or Insert the Restaurant Subscription
            // First fetch the plan to know duration
            const { data: planData } = await supabase.from('subscription_plans').select('duration_days').eq('id', planId).single();
            const days = planData?.duration_days || 30;

            // Calculate new end date from today
            const newEndDate = new Date();
            newEndDate.setDate(newEndDate.getDate() + days);

            // Upsert the subscription record
            const { error: subError } = await supabase.from('restaurant_subscriptions').upsert({
                restaurant_id: restaurantId,
                plan_id: planId,
                status: 'active',
                current_period_end: newEndDate.toISOString()
            }, { onConflict: 'restaurant_id' });

            if (subError) {
                console.error("Failed to update subscription", subError);
                return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?status=update_failed`);
            }

            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?status=success`);
        } else {
            // Handle pending or other statuses if necessary
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?status=${status.toLowerCase()}`);
        }

    } catch (error) {
        console.error("eSewa Verification Error:", error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?status=error`);
    }
}
