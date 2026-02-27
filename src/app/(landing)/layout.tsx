'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import './landing.css';

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // Force light theme for landing
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.classList.remove('dark');

        const lenis = new Lenis({
            lerp: 0.1,
            duration: 1.2,
            smoothWheel: true,
        });
        lenisRef.current = lenis;

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <div className="landing-root" style={{ background: '#FAFAFA', color: '#09090B' }}>
            {children}
        </div>
    );
}
