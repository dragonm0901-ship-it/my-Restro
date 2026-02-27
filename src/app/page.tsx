'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import './(landing)/landing.css';

import Navbar from './(landing)/components/Navbar';
import Hero from './(landing)/components/Hero';
import Features from './(landing)/components/Features';
import HowItWorks from './(landing)/components/HowItWorks';
import Gallery from './(landing)/components/Gallery';
import Testimonials from './(landing)/components/Testimonials';
import Pricing from './(landing)/components/Pricing';
import CTABanner from './(landing)/components/CTABanner';
import Footer from './(landing)/components/Footer';

export default function HomePage() {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // Force light theme for landing page
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.classList.remove('dark');
        document.body.style.background = '#FAFAFA';
        document.body.style.color = '#09090B';

        // Initialize Lenis smooth scroll
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
            <Navbar />
            <main>
                <Hero />
                <Features />
                <HowItWorks />
                <Gallery />
                <Testimonials />
                <Pricing />
                <CTABanner />
            </main>
            <Footer />
        </div>
    );
}
