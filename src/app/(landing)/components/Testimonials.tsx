'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from '@phosphor-icons/react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
    {
        name: 'Rajesh Shrestha',
        role: 'Owner, Himalayan Kitchen',
        text: 'myRestro transformed how we manage our restaurant. Orders flow seamlessly from QR codes to the kitchen display. Our turnaround time dropped by 40%.',
        rating: 5,
    },
    {
        name: 'Sita Gurung',
        role: 'Manager, Café Thamel',
        text: 'The digital menu and QR ordering system is a game-changer. Customers love ordering from their phones and our staff can focus on service quality.',
        rating: 5,
    },
    {
        name: 'Prakash Tamang',
        role: 'Head Chef, Durbar Bistro',
        text: 'As a chef, the Kitchen Display System is incredible. I see orders in real-time, prioritize by timing, and never miss a ticket. It just works beautifully.',
        rating: 5,
    },
];

export default function Testimonials() {
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

            const cards = cardsRef.current?.querySelectorAll('.testimonial-card');
            if (cards) {
                gsap.fromTo(
                    cards,
                    { opacity: 0, y: 40, scale: 0.96 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
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
            ref={sectionRef}
            style={{
                padding: '120px 24px',
                background: '#FFFFFF',
            }}
        >
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                {/* Heading */}
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
                        Testimonials
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
                        Loved by restaurant<br />owners across Nepal
                    </h2>
                </div>

                {/* Cards */}
                <div
                    ref={cardsRef}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '24px',
                    }}
                >
                    {testimonials.map((t, i) => (
                        <div key={i} className="testimonial-card">
                            {/* Stars */}
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                                {Array.from({ length: t.rating }).map((_, j) => (
                                    <Star key={j} size={18} weight="fill" style={{ color: '#F59E0B' }} />
                                ))}
                            </div>

                            {/* Quote */}
                            <p style={{
                                fontSize: '15px',
                                lineHeight: 1.7,
                                color: '#52525B',
                                marginBottom: '24px',
                                fontFamily: "'Inter', sans-serif",
                                fontStyle: 'italic',
                            }}>
                                &ldquo;{t.text}&rdquo;
                            </p>

                            {/* Author */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: '12px',
                                    background: '#F4F4F5',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontFamily: "'Outfit', sans-serif",
                                    fontWeight: 800,
                                    fontSize: '16px',
                                    color: '#09090B',
                                }}>
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <p style={{
                                        fontSize: '14px',
                                        fontWeight: 700,
                                        color: '#09090B',
                                        fontFamily: "'Inter', sans-serif",
                                    }}>
                                        {t.name}
                                    </p>
                                    <p style={{
                                        fontSize: '12px',
                                        color: '#A1A1AA',
                                        fontFamily: "'Inter', sans-serif",
                                    }}>
                                        {t.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
