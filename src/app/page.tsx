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
import ROICalculator from './(landing)/components/ROICalculator';
import InteractiveDemo from './(landing)/components/InteractiveDemo';
import IntegrationsGrid from './(landing)/components/IntegrationsGrid';
import UseCaseTabs from './(landing)/components/UseCaseTabs';
import VideoExplainer from './(landing)/components/VideoExplainer';

export default function HomePage() {
    return (
        <div className="landing-root" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <Navbar />
            <main>
                <Hero />
                <ROICalculator />
                <Features />
                <HowItWorks />
                <IntegrationsGrid />
                <Gallery />
                <InteractiveDemo />
                <Testimonials />
                <UseCaseTabs />
                <Pricing />
                <VideoExplainer />
                <CTABanner />
            </main>
            <Footer />
        </div>
    );
}

