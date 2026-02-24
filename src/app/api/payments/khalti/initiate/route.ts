import { NextResponse } from 'next/server';

const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || "8gBm/:&EnhH.1/q";
const KHALTI_INITIATE_URL = "https://a.khalti.com/api/v2/epayment/initiate/";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { amount, productName, restaurantId, planId, customerInfo } = body;

        // Khalti requiresamount in Paisa (amount_in_rs * 100)
        const amountInPaisa = parseInt(amount) * 100;

        // Generate internal purchase order ID
        const purchaseOrderId = `${restaurantId}-${planId}-${Date.now()}`;

        const payload = {
            return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payments/khalti/verify`,
            website_url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            amount: amountInPaisa,
            purchase_order_id: purchaseOrderId,
            purchase_order_name: productName,
            customer_info: {
                name: customerInfo.name || "Restaurant Owner",
                email: customerInfo.email || "test@test.com",
                phone: customerInfo.phone || "9800000000"
            }
        };

        const response = await fetch(KHALTI_INITIATE_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Key ${KHALTI_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            // Khalti returns a payment_url to redirect to and a pidx token
            return NextResponse.json({
                payment_url: data.payment_url,
                pidx: data.pidx
            });
        } else {
            console.error("Khalti initiation failed:", data);
            return NextResponse.json({ error: data.detail || "Khalti initiation failed" }, { status: 400 });
        }

    } catch (error) {
        console.error("Khalti API Route Error:", error);
        return NextResponse.json({ error: "Server error initiating payment" }, { status: 500 });
    }
}
