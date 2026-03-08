'use client';

import { useEffect } from 'react';
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
    useEffect(() => {
        // Force light theme for landing page
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.classList.remove('dark');
        document.body.style.background = '#FAFAFA';
        document.body.style.color = '#09090B';
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
