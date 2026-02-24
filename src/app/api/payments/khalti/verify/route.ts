import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || "8gBm/:&EnhH.1/q";
const KHALTI_LOOKUP_URL = "https://a.khalti.com/api/v2/epayment/lookup/";

export async function GET(req: Request) {
    // Initialize Supabase Admin Client to bypass RLS for server-side updates
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const { searchParams } = new URL(req.url);

        // Khalti redirects back with these parameters
        const pidx = searchParams.get('pidx');
        const transactionId = searchParams.get('transaction_id');
        const amount = searchParams.get('amount');
        const purchaseOrderId = searchParams.get('purchase_order_id');
        // 'status' can be Completed, Pending, User canceled, etc.

        if (!pidx || !purchaseOrderId || !amount) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?status=invalid_request`);
        }

        // 1. Double check the status using the Khalti Lookup API
        // This prevents users from simply hitting the success URL manually
        const lookupResponse = await fetch(KHALTI_LOOKUP_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Key ${KHALTI_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pidx })
        });

        const lookupData = await lookupResponse.json();

        // 2. Parse the purchaseOrderId to get internal references
        // We formatted it as `${restaurantId}-${planId}-${timestamp}`
        const [restaurantId, planId] = purchaseOrderId.split('-');

        if (lookupResponse.ok && lookupData.status === 'Completed') {
            // 3. Log the successful transaction
            await supabase.from('payment_transactions').insert({
                restaurant_id: restaurantId,
                plan_id: planId,
                amount_npr: parseInt(amount) / 100, // Convert from Paisa back to Rupee
                payment_method: 'khalti',
                status: 'completed',
                transaction_id: transactionId,
                reference_id: pidx,
                gateway_response: lookupData
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
            console.error("Khalti Validation failed or payment not completed.", lookupData);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?status=${lookupData.status?.toLowerCase() || 'failed'}`);
        }

    } catch (error) {
        console.error("Khalti Verification Error:", error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?status=error`);
    }
}
