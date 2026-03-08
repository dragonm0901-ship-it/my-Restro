'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChartLineUp, Users, ChefHat, UserCircle, CheckCircle } from '@phosphor-icons/react';

type Tab = 'owners' | 'staff' | 'kitchen' | 'customers';

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'owners', label: 'For Owners', icon: ChartLineUp },
    { id: 'staff', label: 'For Waitstaff', icon: Users },
    { id: 'kitchen', label: 'For the Kitchen', icon: ChefHat },
    { id: 'customers', label: 'For Customers', icon: UserCircle },
];

const content: Record<Tab, { title: string; desc: string; features: string[] }> = {
    owners: {
        title: "Total Control & Deep Analytics",
        desc: "Stop guessing what sells. Get real-time data on your best performing dishes, peak hours, and staff efficiency, all from your phone.",
        features: [
            "Live revenue dashboards & daily reports",
            "Inventory depletion tracking",
            "Granular role-based permissions",
            "Multi-location management from one terminal"
        ],
    },
    staff: {
        title: "Fewer Mistakes, Faster Service",
        desc: "Empower your waitstaff with a POS system that is actually easy to use. Spend less time punching in orders and more time serving guests.",
        features: [
            "Lightning-fast, intuitive POS interface",
            "Split bills with a single tap",
            "Instant notifications when food is ready",
            "Automatic tip calculations"
        ],
    },
    kitchen: {
        title: "A Calm & Synchronized Kitchen",
        desc: "Replace chaotic paper tickets with a sleek Kitchen Display System (KDS). Prioritize orders instantly and track prep times automatically.",
        features: [
            "Color-coded order prioritization",
            "Drag-and-drop order management",
            "Item-level completion tracking",
            "Clear allergy & modification alerts"
        ],
    },
    customers: {
        title: "The Ultimate Dining Experience",
        desc: "Wow your guests with a futuristic digital menu. Let them order at their own pace, view dishes in stunning 3D Augmented Reality, and pay securely.",
        features: [
            "No-app-required QR code scanning",
            "Interactive 3D AR dish viewing",
            "Instant waiter call button",
            "Seamless local payment gateway integrations"
        ],
    }
};

export default function UseCaseTabs() {
    const [activeTab, setActiveTab] = useState<Tab>('owners');

    return (
        <section className="py-24 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black font-['Outfit'] mb-6 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                        Built for <span className="text-gradient">Everyone</span>
                    </h2>
                    <p className="text-lg max-w-2xl mx-auto font-['Inter']" style={{ color: 'var(--text-secondary)' }}>
                        A great restaurant system doesn&apos;t just help the owner. It makes life easier for the entire team and provides a magical experience for guests.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">
                    
                    {/* Left: Responsive Tabs */}
                    <div className="lg:col-span-4 flex flex-row lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide snap-x">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className="flex items-center gap-4 px-6 py-5 rounded-2xl transition-all duration-300 text-left min-w-[220px] shrink-0 lg:min-w-0 lg:w-full snap-start"
                                    style={{
                                        background: isActive ? 'var(--bg-card)' : 'transparent',
                                        border: isActive ? '1px solid var(--border-hover)' : '1px solid transparent',
                                        boxShadow: isActive ? 'var(--shadow-card)' : 'none',
                                    }}
                                >
                                    <div className="p-2.5 rounded-xl transition-colors" style={{
                                        background: isActive ? 'var(--accent)' : 'var(--bg-elevated)',
                                        color: isActive ? 'var(--accent-fg)' : 'var(--text-muted)',
                                    }}>
                                        <Icon size={24} weight={isActive ? "fill" : "regular"} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg" style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                            {tab.label}
                                        </h3>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right: Dynamic Content Area */}
                    <div className="lg:col-span-8 rounded-3xl overflow-hidden min-h-[600px] lg:min-h-[500px] relative" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="absolute inset-0 flex flex-col md:flex-row h-full overflow-y-auto"
                            >
                                {/* Text Content */}
                                <div className="p-8 md:p-10 flex flex-col justify-center flex-1 z-10">
                                    <h3 className="text-2xl font-black font-['Outfit'] mb-4" style={{ color: 'var(--text-primary)' }}>
                                        {content[activeTab].title}
                                    </h3>
                                    <p className="leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
                                        {content[activeTab].desc}
                                    </p>
                                    
                                    <ul className="space-y-4">
                                        {content[activeTab].features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" weight="fill" style={{ color: 'var(--success)' }} />
                                                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Placeholder Visual Area */}
                                <div className="flex-1 min-h-[300px] md:min-h-0 relative overflow-hidden group shrink-0" style={{ background: 'var(--bg-elevated)' }}>
                                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, var(--text-muted) 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
                                    
                                    <div className="absolute inset-0 flex items-center justify-center p-8">
                                        <div className="w-full max-w-[280px] aspect-3/4 rounded-2xl shadow-2xl overflow-hidden relative group-hover:scale-105 transition-transform duration-700" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                                            {/* Top bar mockup */}
                                            <div className="h-8 flex items-center px-4 gap-1.5" style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}>
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                                            </div>
                                            {/* Content lines mockup */}
                                            <div className="p-6 space-y-4">
                                                <div className="h-4 w-3/4 rounded animate-pulse" style={{ background: 'var(--bg-elevated)' }} />
                                                <div className="h-4 w-1/2 rounded animate-pulse" style={{ background: 'var(--bg-elevated)' }} />
                                                <div className="h-24 w-full rounded-xl mt-6 flex items-center justify-center" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                                                    <div className="w-12 h-12 rounded-full animate-spin" style={{ border: '4px solid var(--border)', borderTopColor: 'var(--accent)' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
