import { NextResponse } from 'next/server';
import crypto from 'crypto-js';

// eSewa Sandbox Credentials (Replace with Production keys later)
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";
const ESEWA_MERCHANT_CODE = process.env.ESEWA_MERCHANT_CODE || "EPAYTEST";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { amount, restaurantId, planId } = body;

        // 1. Generate a unique transaction ID (eSewa requires this to be unique for every request)
        // We'll use a combination of restaurantId, planId, and timestamp
        const transactionUuid = `${restaurantId}-${planId}-${Date.now()}`;

        // 2. Prepare the data string for HMAC hashing as per eSewa v2 docs
        // Format: total_amount,transaction_uuid,product_code
        // Note: amount must be a string with exactly 2 decimal places if required, or plain integer if so. We use strictly what is passed.
        const totalAmount = amount.toString();
        const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${ESEWA_MERCHANT_CODE}`;

        // 3. Generate HMAC SHA256 signature
        const hash = crypto.HmacSHA256(message, ESEWA_SECRET_KEY);
        const signature = crypto.enc.Base64.stringify(hash);

        // 4. Send back the required payload to the frontend to submit the form
        return NextResponse.json({
            amount: totalAmount,
            tax_amount: "0",
            total_amount: totalAmount,
            transaction_uuid: transactionUuid,
            product_code: ESEWA_MERCHANT_CODE,
            product_service_charge: "0",
            product_delivery_charge: "0",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payments/esewa/verify`,
            failure_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings/billing?status=failed`,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            signature: signature,
        });

    } catch (error) {
        console.error("eSewa Initiation Error:", error);
        return NextResponse.json({ error: "Failed to initiate payment" }, { status: 500 });
    }
}
