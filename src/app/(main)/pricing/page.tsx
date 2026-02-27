'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check as Check,
    ShieldCheck as Shield,
    CreditCard as CreditCard,
    CaretRight as ChevronRight,
    CheckCircle as CheckCircle,
    Minus as Minus
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    const plans = [
        {
            id: 'basic',
            name: 'Basic',
            price: 999, // NPR
            description: 'Essential tools for small cafes',
            color: 'var(--text-primary)',
            features: ['Up to 5 tables', 'Digital Menu', 'Basic Order Management', 'Standard Support'],
            popular: false,
        },
        {
            id: 'pro',
            name: 'Pro',
            price: 1599, // NPR
            description: 'Advanced features for growing venues',
            color: 'var(--accent)',
            features: ['Unlimited tables', 'Kitchen Display System', 'Advanced Reports', 'Inventory Tracking', 'Priority Support'],
            popular: true,
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: 2999, // NPR
            description: 'Complete suite for large or multi-branch',
            color: 'var(--text-primary)',
            features: ['Custom POS Integrations', 'Multi-branch sync', 'API Access', 'Dedicated Account Manager', '24/7 Phone Support'],
            popular: false,
        }
    ];

    const handleSelectPlan = (planId: string) => {
        setSelectedPlan(planId);
        // Scroll slightly or just open modal equivalent (here just state toggle)
    };

    const handlePayment = (gateway: string) => {
        toast.loading(`Redirecting to ${gateway}...`);
        setTimeout(() => toast.dismiss(), 1500);
        // Implement actual gateway redirect logic here
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 page-enter pb-10">
            {/* Header Section */}
            <div className="text-center space-y-4 pt-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: 'var(--accent-light)', color: 'var(--accent-text)' }}>
                    <span className="text-xs font-semibold uppercase tracking-wider">Upgrade Your Restaurant</span>
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl md:text-5xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    Our plans scale with your business
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                    Choose the plan that fits your business needs. Upgrade anytime as you grow. Start dominating the market today.
                </motion.p>
            </div>

            {/* Billing Toggle */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="flex justify-center">
                <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold transition-colors ${billingCycle === 'monthly' ? '' : 'opacity-50'}`} style={{ color: 'var(--text-primary)' }}>Monthly</span>
                    <div
                        className="relative w-12 h-6 rounded-full cursor-pointer transition-colors border border-gray-200 dark:border-zinc-700"
                        style={{ background: billingCycle === 'yearly' ? 'var(--accent)' : 'var(--bg-elevated)' }}
                        onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                    >
                        <motion.div
                            className="absolute top-1 w-3.5 h-3.5 rounded-full shadow-sm bg-gray-500 dark:bg-white"
                            style={{ 
                                background: billingCycle === 'yearly' ? '#ffffff' : undefined,
                            }}
                            animate={{ left: billingCycle === 'yearly' ? 28 : 5 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className={`text-sm font-semibold transition-colors ${billingCycle === 'yearly' ? '' : 'opacity-50'}`} style={{ color: 'var(--text-primary)' }}>Annually</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold border" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}>Save 20%</span>
                    </div>
                </div>
            </motion.div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan, i) => {
                    const price = plan.price; // Base price, adjust for monthly/annual display
                    const displayPrice = billingCycle === 'yearly' ? Math.round(price * 0.8) : price; // Assuming ~20% annual discount
                    const isSelected = selectedPlan === plan.id;

                    return (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + i * 0.1 }}
                            className={`relative flex flex-col p-6 rounded-3xl transition-all duration-300 card-hover cursor-pointer ${plan.popular ? 'border-2' : 'border'}`}
                            style={{
                                background: 'var(--bg-card)',
                                borderColor: isSelected ? plan.color : (plan.popular ? plan.color : 'var(--border)'),
                                boxShadow: isSelected ? `0 0 0 4px color-mix(in srgb, ${plan.color} 20%, transparent)` : (plan.popular ? `0 10px 30px -10px color-mix(in srgb, ${plan.color} 30%, transparent)` : 'none')
                            }}
                            onClick={() => handleSelectPlan(plan.id)}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md overflow-hidden"
                                    style={{ background: plan.color, color: plan.color === 'var(--text-primary)' ? 'var(--bg-primary)' : 'var(--accent-fg)' }}>
                                    <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                                    <span style={{ position: 'relative', zIndex: 10 }}>Most Popular</span>
                                </div>
                            )}

                            <div className="mb-6 mt-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `color-mix(in srgb, ${plan.color} 15%, transparent)` }}>
                                    <span className="text-xl font-bold" style={{ color: plan.color }}>{plan.name.charAt(0)}</span>
                                </div>
                                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{plan.name}</h3>
                                <p className="text-xs mt-1 h-8" style={{ color: 'var(--text-muted)' }}>{plan.description}</p>
                            </div>

                            <div className="mb-6 grow">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>NPR {displayPrice.toLocaleString()}</span>
                                        <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>/ mo</span>
                                    </div>
                                    {billingCycle === 'yearly' && (
                                        <p className="text-[10px] font-semibold" style={{ color: 'var(--text-secondary)' }}>Billed annually (NPR {(displayPrice * 12).toLocaleString()}/yr)</p>
                                    )}
                                    {billingCycle === 'monthly' && (
                                        <p className="text-[10px] font-semibold opacity-0 pointer-events-none">Placeholder</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3 mb-8">
                                {plan.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-2.5">
                                        <div className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: `color-mix(in srgb, ${plan.color} 15%, transparent)` }}>
                                            <Check className="w-2.5 h-2.5" weight="bold" style={{ color: plan.color }} strokeWidth={3} />
                                        </div>
                                        <span className="text-[13px] font-medium leading-tight" style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                className="w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 group"
                                style={{
                                    background: isSelected ? plan.color : 'var(--bg-input)',
                                    color: isSelected ? (plan.color === 'var(--text-primary)' ? 'var(--bg-primary)' : 'var(--accent-fg)') : 'var(--text-primary)'
                                }}
                            >
                                {isSelected ? 'Selected' : 'Select Plan'}
                                {!isSelected && <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" weight="bold" />}
                            </button>
                        </motion.div>
                    );
                })}
            </div>

            {/* Feature Comparison Table */}
            <div className="pt-16 max-w-4xl mx-auto hidden md:block">
                <h3 className="text-2xl font-bold text-center mb-10" style={{ color: 'var(--text-primary)' }}>Compare Features</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border)' }}>
                                <th className="py-4 px-6 font-semibold" style={{ color: 'var(--text-primary)' }}>Features</th>
                                <th className="py-4 px-6 font-semibold text-center" style={{ color: 'var(--text-primary)' }}>Basic</th>
                                <th className="py-4 px-6 font-semibold text-center" style={{ color: 'var(--text-primary)' }}>Pro</th>
                                <th className="py-4 px-6 font-semibold text-center" style={{ color: 'var(--text-primary)' }}>Premium</th>
                            </tr>
                        </thead>
                        <tbody style={{ color: 'var(--text-secondary)' }}>
                            {[
                                { name: 'Tables Supported', basic: 'Up to 5', pro: 'Unlimited', ent: 'Unlimited', type: 'text' },
                                { name: 'Digital Menu & QR', basic: true, pro: true, ent: true, type: 'check' },
                                { name: 'Order Management', basic: 'Basic', pro: 'Advanced', ent: 'Custom', type: 'text' },
                                { name: 'Kitchen Display (KDS)', basic: false, pro: true, ent: true, type: 'check' },
                                { name: 'Inventory & Stock Alerts', basic: false, pro: true, ent: true, type: 'check' },
                                { name: 'Multi-branch Sync', basic: false, pro: false, ent: true, type: 'check' },
                                { name: 'Staff Management', basic: 'Basic', pro: 'Full', ent: 'Full w/ Roles', type: 'text' },
                                { name: 'Support', basic: 'Standard', pro: 'Priority', ent: '24/7 Dedicated', type: 'text' },
                            ].map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td className="py-4 px-6 text-sm font-medium">{row.name}</td>
                                    <td className="py-4 px-6 text-center text-sm">
                                        {row.type === 'check' ? (row.basic ? <CheckCircle weight="fill" className="w-5 h-5 mx-auto" style={{ color: 'var(--info)' }} /> : <Minus className="w-4 h-4 mx-auto opacity-30" />) : row.basic}
                                    </td>
                                    <td className="py-4 px-6 text-center text-sm">
                                        {row.type === 'check' ? (row.pro ? <CheckCircle weight="fill" className="w-5 h-5 mx-auto" style={{ color: 'var(--accent)' }} /> : <Minus className="w-4 h-4 mx-auto opacity-30" />) : row.pro}
                                    </td>
                                    <td className="py-4 px-6 text-center text-sm">
                                        {row.type === 'check' ? (row.ent ? <CheckCircle weight="fill" className="w-5 h-5 mx-auto" style={{ color: 'var(--success)' }} /> : <Minus className="w-4 h-4 mx-auto opacity-30" />) : row.ent}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment Section - Shows only if a plan is selected */}
            <AnimatePresence>
                {selectedPlan && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 40 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-8 rounded-3xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                            <div className="text-center mb-8">
                                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Choose Payment Method</h3>
                                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Secure payment options in Nepal.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 custom-scrollbar">
                                {/* eSewa Option */}
                                <button
                                    onClick={() => handlePayment('eSewa')}
                                    className="relative flex flex-col items-center p-6 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg"
                                    style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}
                                >
                                    <div className="w-full h-12 flex items-center justify-center mb-3">
                                        <span className="text-2xl font-black italic tracking-tighter" style={{ color: '#60a744' }}>eSewa</span>
                                    </div>
                                    <span className="text-sm font-bold" style={{ color: '#60a744' }}>Pay via eSewa</span>
                                </button>

                                {/* Khalti Option */}
                                <button
                                    onClick={() => handlePayment('Khalti')}
                                    className="relative flex flex-col items-center p-6 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg"
                                    style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}
                                >
                                    <div className="w-full h-12 flex items-center justify-center mb-3">
                                        <span className="text-2xl font-black tracking-tighter" style={{ color: '#56328c' }}>Khalti</span>
                                    </div>
                                    <span className="text-sm font-bold" style={{ color: '#56328c' }}>Pay via Khalti</span>
                                </button>

                                {/* Bank Transfer Option */}
                                <button
                                    onClick={() => handlePayment('Bank Transfer')}
                                    className="relative flex flex-col items-center p-6 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg gap-1"
                                    style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}
                                >
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" style={{ background: 'rgba(59,130,246,0.1)' }}>
                                        <CreditCard className="w-6 h-6" weight="fill" style={{ color: '#3b82f6' }} />
                                    </div>
                                    <span className="text-sm font-bold leading-none" style={{ color: 'var(--text-primary)' }}>Bank Transfer</span>
                                    <span className="text-[10px] font-semibold leading-none pt-1" style={{ color: 'var(--text-muted)' }}>IPS / NEPALPAY</span>
                                </button>
                            </div>

                            <div className="mt-8 flex items-center justify-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                                <Shield className="w-4 h-4" weight="fill" />
                                <span>256-bit secure encryption by leading local gateways</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
