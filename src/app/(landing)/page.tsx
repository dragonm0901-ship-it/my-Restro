import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import CTABanner from './components/CTABanner';
import Footer from './components/Footer';
import InteractiveDemo from './components/InteractiveDemo';
import ROICalculator from './components/ROICalculator';

import UseCaseTabs from './components/UseCaseTabs';
import VideoExplainer from './components/VideoExplainer';

export default function LandingPage() {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <ROICalculator />
                <Features />
                <HowItWorks />

                <Gallery />
                <InteractiveDemo />
                <Testimonials />
                <UseCaseTabs />
                <Pricing />
                <VideoExplainer />
                <CTABanner />
            </main>
            <Footer />
        </>
    );
}
