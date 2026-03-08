'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const galleryImages = [
    { src: '/landing/restaurant-1.png', label: 'Fine Dining' },
    { src: '/landing/restaurant-2.png', label: 'Gourmet Cuisine' },
    { src: '/landing/restaurant-3.png', label: 'Rooftop Experience' },
    { src: '/landing/restaurant-4.png', label: 'Cocktail Lounge' },
    { src: '/landing/restaurant-5.png', label: 'Open Kitchen' },
    { src: '/landing/restaurant-6.png', label: 'Private Dining' },
];

export default function Gallery() {
    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);

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

            // Horizontal scroll
            if (trackRef.current && sectionRef.current) {
                const track = trackRef.current;
                const scrollWidth = track.scrollWidth - window.innerWidth + 100;

                gsap.to(track, {
                    x: -scrollWidth,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top top',
                        end: () => `+=${scrollWidth}`,
                        scrub: 1,
                        pin: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="gallery"
            ref={sectionRef}
            style={{
                padding: '120px 0 60px',
                overflow: 'hidden',
            }}
        >
            {/* Heading */}
            <div ref={headingRef} style={{ textAlign: 'center', marginBottom: '48px', padding: '0 24px' }}>
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
                    Gallery
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
                    Built for restaurants<br />that demand excellence
                </h2>
                <p style={{
                    fontSize: '17px',
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)',
                    maxWidth: '480px',
                    margin: '0 auto',
                    fontFamily: "'Inter', sans-serif",
                }}>
                    From intimate cafés to multi-branch empires — myRestro adapts to every hospitality vision.
                </p>
            </div>

            {/* Horizontal Track */}
            <div
                ref={trackRef}
                className="gallery-track"
                style={{
                    paddingLeft: '48px',
                    paddingRight: '48px',
                    paddingBottom: '20px',
                }}
            >
                {galleryImages.map((img, i) => (
                    <div key={i} className="gallery-item">
                        <Image
                            src={img.src}
                            alt={img.label}
                            width={420}
                            height={320}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <span className="gallery-label">{img.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
