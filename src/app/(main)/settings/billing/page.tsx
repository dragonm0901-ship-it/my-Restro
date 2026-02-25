'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Check as Check, CircleNotch as Loader2 } from '@phosphor-icons/react';
import { createClient } from '@/lib/supabase';
import { useRoleStore } from '@/stores/useRoleStore';

interface Plan {
    id: string;
    name: string;
    description: string;
    price_npr: number;
    duration_days: number;
}

function BillingContent() {
    const searchParams = useSearchParams();
    const { restaurantId, userName } = useRoleStore();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loadingPlans, setLoadingPlans] = useState(true);
    const [submitting, setSubmitting] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        const status = searchParams.get('status');
        if (status === 'success') {
            toast.success("Payment successful! Your subscription is active.");
        } else if (status === 'failed' || status === 'verification_failed') {
            toast.error("Payment failed or verification error.");
        } else if (status === 'user_canceled') {
            toast.error("Payment canceled by user.");
        } else if (status === 'error') {
            toast.error("An error occurred processing the payment.");
        }

        const fetchPlans = async () => {
            const { data, error } = await supabase.from('subscription_plans').select('*').order('price_npr', { ascending: true });
            if (data) setPlans(data);
            if (error) {
                if (error.code !== '42P01' && Object.keys(error).length > 0) {
                    console.error("Error fetching plans:", error);
                }
            }
            setLoadingPlans(false);
        };

        fetchPlans();
    }, [searchParams, supabase]);

    const handleEsewaPayment = async (plan: Plan) => {
        if (!restaurantId) return toast.error("No restaurant linked.");
        setSubmitting('esewa');

        try {
            const res = await fetch('/api/payments/esewa/initiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: plan.price_npr,
                    productId: plan.id,
                    productName: plan.name,
                    restaurantId: restaurantId,
                    planId: plan.id
                })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            // eSewa requires a form submission
            const form = document.createElement('form');
            form.setAttribute('method', 'POST');
            form.setAttribute('action', 'https://rc-epay.esewa.com.np/api/epay/main/v2/form');

            const params = {
                amount: data.amount,
                tax_amount: data.tax_amount,
                total_amount: data.total_amount,
                transaction_uuid: data.transaction_uuid,
                product_code: data.product_code,
                product_service_charge: data.product_service_charge,
                product_delivery_charge: data.product_delivery_charge,
                success_url: data.success_url,
                failure_url: data.failure_url,
                signed_field_names: data.signed_field_names,
                signature: data.signature,
            };

            for (const key in params) {
                const hiddenField = document.createElement('input');
                hiddenField.setAttribute('type', 'hidden');
                hiddenField.setAttribute('name', key);
                hiddenField.setAttribute('value', params[key as keyof typeof params]);
                form.appendChild(hiddenField);
            }

            document.body.appendChild(form);
            form.submit();

        } catch (error) {
            console.error("eSewa error:", error);
            toast.error("Failed to initiate eSewa payment.");
            setSubmitting(null);
        }
    };

    const handleKhaltiPayment = async (plan: Plan) => {
        if (!restaurantId) return toast.error("No restaurant linked.");
        setSubmitting('khalti');

        try {
            const res = await fetch('/api/payments/khalti/initiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: plan.price_npr,
                    productName: plan.name,
                    restaurantId: restaurantId,
                    planId: plan.id,
                    customerInfo: {
                        name: userName,
                        email: "test@example.com", // In a real app, pull from profile
                        phone: "9800000000"
                    }
                })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            if (data.payment_url) {
                window.location.href = data.payment_url;
            } else {
                toast.error("Invalid response from Khalti.");
                setSubmitting(null);
            }

        } catch (error) {
            console.error("Khalti error:", error);
            toast.error("Failed to initiate Khalti payment.");
            setSubmitting(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-2">Upgrade Subscription</h1>
            <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Choose the best plan for your restaurant layout and staff size.</p>

            {loadingPlans ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin h-10 w-10" style={{ color: 'var(--accent)' }} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <div key={plan.id} className="border rounded-2xl p-6 flex flex-col transition-colors shadow-sm"
                            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                            <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                            <p className="text-sm mb-4 h-10" style={{ color: 'var(--text-muted)' }}>{plan.description}</p>
                            <div className="mb-6 border-b pb-6" style={{ borderColor: 'var(--border)' }}>
                                <span className="text-4xl font-black block">NPR {plan.price_npr}</span>
                                <span className="text-sm mt-1 block" style={{ color: 'var(--text-muted)' }}>{plan.duration_days} days coverage</span>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-green-500" weight="bold" />
                                    <span>All Core Features</span>
                                </li>
                                {plan.price_npr > 0 && (
                                    <>
                                        <li className="flex items-center gap-2">
                                            <Check className="h-5 w-5 text-green-500" weight="bold" />
                                            <span>Premium Support</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="h-5 w-5 text-green-500" weight="bold" />
                                            <span>Real-time Kitchen Display</span>
                                        </li>
                                    </>
                                )}
                            </ul>

                            <div className="flex flex-col gap-3 mt-auto">
                                {plan.price_npr > 0 ? (
                                    <>
                                        <button
                                            onClick={() => handleEsewaPayment(plan)}
                                            disabled={submitting !== null}
                                            className="w-full py-3 rounded-xl font-bold text-white bg-[#60BB46] hover:bg-[#52a13b] transition-colors flex justify-center items-center"
                                        >
                                            {submitting === 'esewa' ? <Loader2 className="animate-spin" /> : "Pay with eSewa"}
                                        </button>
                                        <button
                                            onClick={() => handleKhaltiPayment(plan)}
                                            disabled={submitting !== null}
                                            className="w-full py-3 rounded-xl font-bold text-white bg-[#5C2D91] hover:bg-[#4b2475] transition-colors flex justify-center items-center"
                                        >
                                            {submitting === 'khalti' ? <Loader2 className="animate-spin" /> : "Pay with Khalti"}
                                        </button>
                                    </>
                                ) : (
                                    <button disabled className="w-full py-3 rounded-xl font-bold text-gray-400 bg-gray-100 border border-gray-200">
                                        Current Plan
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function BillingPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10" style={{ color: 'var(--accent)' }} /></div>}>
            <BillingContent />
        </Suspense>
    );
}
