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
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.7)',
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
                    color: '#FFFFFF',
                    marginBottom: '18px',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    Start managing smarter,<br />not harder
                </h2>

                <p style={{
                    fontSize: '17px',
                    lineHeight: 1.6,
                    color: 'rgba(255, 255, 255, 0.6)',
                    maxWidth: '460px',
                    margin: '0 auto 36px',
                    fontFamily: "'Inter', sans-serif",
                    position: 'relative',
                    zIndex: 1,
                }}>
                    Join 200+ restaurants already using myRestro. No credit card required. Cancel anytime.
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
                            background: '#FFFFFF',
                            color: '#09090B',
                            borderRadius: '14px',
                            fontWeight: 700,
                            fontSize: '15px',
                            textDecoration: 'none',
                            transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                            fontFamily: "'Inter', sans-serif",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,255,255,0.2)';
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
                            color: 'rgba(255, 255, 255, 0.8)',
                            borderRadius: '14px',
                            fontWeight: 600,
                            fontSize: '15px',
                            textDecoration: 'none',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            transition: 'all 0.3s ease',
                            fontFamily: "'Inter', sans-serif",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                            e.currentTarget.style.color = '#FFFFFF';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                        }}
                    >
                        Request Demo
                    </Link>
                </div>
            </div>
        </section>
    );
}
