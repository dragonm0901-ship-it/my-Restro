'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        number: '01',
        title: 'Sign up & set up your restaurant',
        description: 'Create your account in under 2 minutes. Add your restaurant name, tables, and staff members. No credit card required.',
    },
    {
        number: '02',
        title: 'Build your digital menu',
        description: 'Upload dishes with photos, prices, and categories. Generate QR codes for each table instantly. Your menu goes live in seconds.',
    },
    {
        number: '03',
        title: 'Start taking orders & growing',
        description: 'Guests order from their phones, your kitchen gets real-time updates, and you track everything from one sleek dashboard.',
    },
];

export default function HowItWorks() {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const stepsRef = useRef<HTMLDivElement>(null);

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

            const stepEls = stepsRef.current?.querySelectorAll('.step-item');
            if (stepEls) {
                stepEls.forEach((el, i) => {
                    gsap.fromTo(
                        el,
                        { opacity: 0, x: i % 2 === 0 ? -40 : 40 },
                        {
                            opacity: 1,
                            x: 0,
                            duration: 0.8,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: el,
                                start: 'top 82%',
                                once: true,
                            },
                        }
                    );
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="how-it-works"
            ref={sectionRef}
            style={{
                padding: '120px 24px',
                background: 'var(--bg-primary)',
            }}
        >
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {/* Heading */}
                <div ref={headingRef} style={{ textAlign: 'center', marginBottom: '64px' }}>
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
                        How it works
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
                        Up and running in<br />three simple steps
                    </h2>
                    <p style={{
                        fontSize: '17px',
                        lineHeight: 1.6,
                        color: 'var(--text-secondary)',
                        maxWidth: '440px',
                        margin: '0 auto',
                        fontFamily: "'Inter', sans-serif",
                    }}>
                        No complex onboarding. No developer needed. Just you and your restaurant.
                    </p>
                </div>

                {/* Steps */}
                <div ref={stepsRef} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '48px' }}>
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            className="step-item"
                            style={{
                                display: 'flex',
                                gap: '24px',
                                alignItems: 'flex-start',
                                position: 'relative',
                            }}
                        >
                            {/* Number */}
                            <div style={{ position: 'relative' }}>
                                <div className="step-number">{step.number}</div>
                                {i < steps.length - 1 && <div className="step-line" />}
                            </div>

                            {/* Content */}
                            <div style={{ paddingTop: '8px', flex: 1 }}>
                                <h3 style={{
                                    fontFamily: "'Outfit', sans-serif",
                                    fontWeight: 700,
                                    fontSize: '22px',
                                    color: 'var(--text-primary)',
                                    marginBottom: '10px',
                                }}>
                                    {step.title}
                                </h3>
                                <p style={{
                                    fontSize: '15px',
                                    lineHeight: 1.65,
                                    color: 'var(--text-secondary)',
                                    fontFamily: "'Inter', sans-serif",
                                }}>
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
