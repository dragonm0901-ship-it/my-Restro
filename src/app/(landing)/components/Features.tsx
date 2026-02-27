'use client';

import { useEffect, useRef } from 'react';
import {
    Storefront,
    CookingPot,
    ChartLineUp,
    QrCode,
    UsersThree,
    Receipt,
} from '@phosphor-icons/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        icon: Storefront,
        title: 'Digital Menu Builder',
        description: 'Create and update your menu in real-time. QR-code powered, always up to date for your guests.',
    },
    {
        icon: CookingPot,
        title: 'Kitchen Display System',
        description: 'Real-time order routing to your kitchen. No more lost tickets. Chefs see exactly what to prepare.',
    },
    {
        icon: ChartLineUp,
        title: 'Analytics & Reports',
        description: 'Track revenue, popular items, peak hours, and staff performance with beautiful dashboards.',
    },
    {
        icon: QrCode,
        title: 'QR Table Ordering',
        description: 'Guests scan, browse, and order — all from their phone. Reduce wait times dramatically.',
    },
    {
        icon: UsersThree,
        title: 'Staff Management',
        description: 'Role-based access for owners, chefs, and waiters. Assign tasks and track performance.',
    },
    {
        icon: Receipt,
        title: 'POS & Billing',
        description: 'Fast, intuitive point-of-sale with split bills, discounts, and payment gateway integrations.',
    },
];

export default function Features() {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Heading reveal
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

            // Staggered card reveal
            const cards = cardsRef.current?.querySelectorAll('.feature-card');
            if (cards) {
                gsap.fromTo(
                    cards,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                        stagger: 0.1,
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
            id="features"
            ref={sectionRef}
            style={{
                padding: '120px 24px',
                maxWidth: '1280px',
                margin: '0 auto',
            }}
        >
            {/* Section Heading */}
            <div ref={headingRef} style={{ textAlign: 'center', marginBottom: '64px' }}>
                <span style={{
                    display: 'inline-block',
                    padding: '6px 16px',
                    borderRadius: '100px',
                    background: '#F4F4F5',
                    border: '1px solid #E4E4E7',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#52525B',
                    marginBottom: '20px',
                    fontFamily: "'Inter', sans-serif",
                }}>
                    Features
                </span>
                <h2 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: 'clamp(28px, 4vw, 48px)',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    color: '#09090B',
                    marginBottom: '16px',
                }}>
                    Everything you need to run<br />
                    your restaurant digitally
                </h2>
                <p style={{
                    fontSize: '17px',
                    lineHeight: 1.6,
                    color: '#71717A',
                    maxWidth: '520px',
                    margin: '0 auto',
                    fontFamily: "'Inter', sans-serif",
                }}>
                    From menu creation to kitchen management, billing to analytics — myRestro replaces 6+ tools with one elegant platform.
                </p>
            </div>

            {/* Feature Grid */}
            <div
                ref={cardsRef}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '24px',
                }}
            >
                {features.map((feature, i) => {
                    const Icon = feature.icon;
                    return (
                        <div key={i} className="feature-card">
                            <div className="feature-icon-wrap">
                                <Icon size={26} weight="duotone" style={{ color: '#09090B', transition: 'color 0.3s ease' }} />
                            </div>
                            <h3 style={{
                                fontFamily: "'Outfit', sans-serif",
                                fontWeight: 700,
                                fontSize: '20px',
                                color: '#09090B',
                                marginBottom: '10px',
                            }}>
                                {feature.title}
                            </h3>
                            <p style={{
                                fontSize: '14px',
                                lineHeight: 1.6,
                                color: '#71717A',
                                fontFamily: "'Inter', sans-serif",
                            }}>
                                {feature.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
