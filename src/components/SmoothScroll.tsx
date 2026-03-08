'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { usePathname } from 'next/navigation';

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);
    const _pathname = usePathname();

    useEffect(() => {
        // Initialize Lenis smooth scroll
        const lenis = new Lenis({
            duration: 1.5,      // Slower duration for that buttery feel
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.1, // Slight boost to wheel speed
            touchMultiplier: 2,   // Faster touch scrolling
            infinite: false,
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

    // Removing the forced scrollTo(0) on pathname change 
    // to allow Next.js to handle native scroll restoration and cross-page hash links natively.

    return <>{children}</>;
}
