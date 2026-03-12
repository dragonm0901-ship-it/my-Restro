'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CTABanner() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                sectionRef.current,
                { opacity: 0, y: 40, scale: 0.97 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.9,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 85%',
                        once: true,
                    },
                }
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <section style={{ padding: '0 24px 120px', maxWidth: '1280px', margin: '0 auto' }}>
            <div ref={sectionRef} className="cta-banner" style={{ textAlign: 'center' }}>
                <span style={{
                    display: 'inline-block',
                    padding: '6px 16px',
                    borderRadius: '100px',
                    background: 'color-mix(in srgb, var(--accent-fg) 10%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--accent-fg) 15%, transparent)',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'color-mix(in srgb, var(--accent-fg) 70%, transparent)',
                    marginBottom: '24px',
                    fontFamily: "'Inter', sans-serif",
                }}>
                    Ready to transform your restaurant?
                </span>

                <h2 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: 'clamp(28px, 4vw, 48px)',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    color: 'var(--accent-fg)',
                    marginBottom: '18px',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    Start managing smarter,<br />not harder
                </h2>

                <p style={{
                    fontSize: '17px',
                    lineHeight: 1.6,
                    color: 'color-mix(in srgb, var(--accent-fg) 60%, transparent)',
                    maxWidth: '460px',
                    margin: '0 auto 36px',
                    fontFamily: "'Inter', sans-serif",
                    position: 'relative',
                    zIndex: 1,
                }}>
                    Join 200+ restaurants already using myRestro Manager. No credit card required. Cancel anytime.
                </p>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    flexWrap: 'wrap',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    <Link
                        href="/login"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '14px 32px',
                            background: 'var(--accent-fg)',
                            color: 'var(--accent)',
                            borderRadius: '14px',
                            fontWeight: 700,
                            fontSize: '15px',
                            textDecoration: 'none',
                            transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                            fontFamily: "'Inter', sans-serif",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px color-mix(in srgb, var(--accent-fg) 20%, transparent)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        Get Started Free
                        <ArrowRight size={18} weight="bold" />
                    </Link>

                    <Link
                        href="/login"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '14px 32px',
                            background: 'transparent',
                            color: 'color-mix(in srgb, var(--accent-fg) 80%, transparent)',
                            borderRadius: '14px',
                            fontWeight: 600,
                            fontSize: '15px',
                            textDecoration: 'none',
                            border: '1px solid color-mix(in srgb, var(--accent-fg) 20%, transparent)',
                            transition: 'all 0.3s ease',
                            fontFamily: "'Inter', sans-serif",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent-fg) 40%, transparent)';
                            e.currentTarget.style.color = 'var(--accent-fg)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent-fg) 20%, transparent)';
                            e.currentTarget.style.color = 'color-mix(in srgb, var(--accent-fg) 80%, transparent)';
                        }}
                    >
                        Request Demo
                    </Link>
                </div>
            </div>
        </section>
    );
}
