'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Check, ArrowRight } from '@phosphor-icons/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const plans = [
    {
        id: 'basic',
        name: 'Basic',
        price: 999,
        description: 'Essential tools for small cafes',
        features: ['Up to 5 tables', 'Digital Menu', 'Basic Order Management', 'Standard Support'],
        popular: false,
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 1599,
        description: 'Advanced features for growing venues',
        features: ['Unlimited tables', 'Kitchen Display System', 'Advanced Reports', 'Inventory Tracking', 'Priority Support'],
        popular: true,
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: 2999,
        description: 'Complete suite for multi-branch operations',
        features: ['Custom POS Integrations', 'Multi-branch sync', 'API Access', 'Dedicated Account Manager', '24/7 Phone Support'],
        popular: false,
    },
];

export default function Pricing() {
    const [yearly, setYearly] = useState(true);
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                headingRef.current,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: headingRef.current,
                        start: 'top 85%',
                        once: true,
                    },
                }
            );

            const cards = cardsRef.current?.children;
            if (cards) {
                gsap.fromTo(
                    cards,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                        stagger: 0.12,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: cardsRef.current,
                            start: 'top 80%',
                            once: true,
                        },
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="pricing"
            ref={sectionRef}
            style={{
                padding: '120px 24px',
                background: 'var(--bg-primary)',
            }}
        >
            <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
                {/* Heading */}
                <div ref={headingRef} style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <span style={{
                        display: 'inline-block',
                        padding: '6px 16px',
                        borderRadius: '100px',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        marginBottom: '20px',
                        fontFamily: "'Inter', sans-serif",
                    }}>
                        Pricing
                    </span>
                    <h2 style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 800,
                        fontSize: 'clamp(28px, 4vw, 48px)',
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-primary)',
                        marginBottom: '16px',
                    }}>
                        Plans that scale with<br />your business
                    </h2>
                    <p style={{
                        fontSize: '17px',
                        lineHeight: 1.6,
                        color: 'var(--text-secondary)',
                        maxWidth: '440px',
                        margin: '0 auto',
                        fontFamily: "'Inter', sans-serif",
                    }}>
                        No hidden fees. Upgrade or downgrade anytime.
                    </p>

                    {/* Toggle */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '14px',
                        marginTop: '32px',
                    }}>
                        <span style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: !yearly ? 'var(--text-primary)' : 'var(--text-muted)',
                            fontFamily: "'Inter', sans-serif",
                            transition: 'color 0.2s ease',
                        }}>
                            Monthly
                        </span>
                        <div
                            className={`pricing-toggle ${yearly ? 'active' : ''}`}
                            onClick={() => setYearly(!yearly)}
                        >
                            <div className="pricing-toggle-knob" />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                                fontSize: '14px',
                                fontWeight: 600,
                                color: yearly ? 'var(--text-primary)' : 'var(--text-muted)',
                                fontFamily: "'Inter', sans-serif",
                                transition: 'color 0.2s ease',
                            }}>
                                Annual
                            </span>
                            <span style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                padding: '3px 10px',
                                borderRadius: '100px',
                                background: '#ECFDF5',
                                color: '#10B981',
                                fontFamily: "'Inter', sans-serif",
                            }}>
                                Save 20%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Cards */}
                <div
                    ref={cardsRef}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '24px',
                        alignItems: 'stretch',
                    }}
                >
                    {plans.map((plan) => {
                        const displayPrice = yearly ? Math.round(plan.price * 0.8) : plan.price;

                        return (
                            <div
                                key={plan.id}
                                style={{
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: '36px 32px',
                                    borderRadius: '24px',
                                    background: 'var(--bg-card)',
                                    border: plan.popular ? '2px solid var(--text-primary)' : '1px solid var(--border)',
                                    transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                                    boxShadow: plan.popular ? 'var(--shadow-card)' : 'none',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-6px)';
                                    e.currentTarget.style.boxShadow = '0 20px 60px -15px rgba(0,0,0,0.12)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = plan.popular ? 'var(--shadow-card)' : 'none';
                                }}
                            >
                                {plan.popular && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-14px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        padding: '5px 18px',
                                        borderRadius: '100px',
                                        background: 'var(--text-primary)',
                                        color: 'var(--bg-primary)',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        fontFamily: "'Inter', sans-serif",
                                    }}>
                                        Most Popular
                                    </div>
                                )}

                                <div style={{ marginBottom: '24px', paddingTop: plan.popular ? '8px' : 0 }}>
                                    <h3 style={{
                                        fontFamily: "'Outfit', sans-serif",
                                        fontWeight: 700,
                                        fontSize: '22px',
                                        color: 'var(--text-primary)',
                                        marginBottom: '6px',
                                    }}>
                                        {plan.name}
                                    </h3>
                                    <p style={{
                                        fontSize: '13px',
                                        color: 'var(--text-muted)',
                                        fontFamily: "'Inter', sans-serif",
                                    }}>
                                        {plan.description}
                                    </p>
                                </div>

                                <div style={{ marginBottom: '28px' }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                        <span style={{
                                            fontFamily: "'Outfit', sans-serif",
                                            fontWeight: 800,
                                            fontSize: '36px',
                                            color: 'var(--text-primary)',
                                            letterSpacing: '-0.02em',
                                        }}>
                                            NPR {displayPrice.toLocaleString()}
                                        </span>
                                        <span style={{
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            color: 'var(--text-muted)',
                                            fontFamily: "'Inter', sans-serif",
                                        }}>
                                            /mo
                                        </span>
                                    </div>
                                    {yearly && (
                                        <p style={{
                                            fontSize: '12px',
                                            color: 'var(--text-secondary)',
                                            marginTop: '4px',
                                            fontFamily: "'Inter', sans-serif",
                                        }}>
                                            Billed annually (NPR {(displayPrice * 12).toLocaleString()}/yr)
                                        </p>
                                    )}
                                </div>

                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                                    {plan.features.map((feature, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '6px',
                                                background: 'var(--bg-elevated)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                            }}>
                                                <Check size={12} weight="bold" style={{ color: 'var(--text-primary)' }} />
                                            </div>
                                            <span style={{
                                                fontSize: '14px',
                                                color: 'var(--text-secondary)',
                                                fontFamily: "'Inter', sans-serif",
                                            }}>
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href="/login"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        padding: '14px',
                                        borderRadius: '14px',
                                        background: plan.popular ? 'var(--text-primary)' : 'var(--bg-elevated)',
                                        color: plan.popular ? 'var(--bg-primary)' : 'var(--text-primary)',
                                        fontWeight: 700,
                                        fontSize: '14px',
                                        textDecoration: 'none',
                                        transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                                        fontFamily: "'Inter', sans-serif",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (plan.popular) {
                                            e.currentTarget.style.opacity = '0.85';
                                        } else {
                                            e.currentTarget.style.background = 'var(--border)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (plan.popular) {
                                            e.currentTarget.style.opacity = '1';
                                        } else {
                                            e.currentTarget.style.background = 'var(--bg-elevated)';
                                        }
                                    }}
                                >
                                    Get Started
                                    <ArrowRight size={16} weight="bold" />
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
