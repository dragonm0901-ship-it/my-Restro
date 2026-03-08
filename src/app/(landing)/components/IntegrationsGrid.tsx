'use client';

import { motion } from 'framer-motion';

const integrations = [
    { name: "eSewa", icon: "🟢" },
    { name: "Khalti", icon: "🟣" },
    { name: "Fonepay", icon: "🔴" },
    { name: "Tally", icon: "📘" },
    { name: "Foodmandu", icon: "🟡" },
    { name: "Pathao", icon: "🏍️" },
    { name: "WhatsApp", icon: "💬" },
    { name: "QuickBooks", icon: "📗" },
];

export default function IntegrationsGrid() {
    return (
        <section className="py-20 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
            <div className="max-w-7xl mx-auto px-6 mb-12 text-center relative z-10">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Integrates With Everything</h3>
                <h2 className="text-3xl font-black font-['Outfit']" style={{ color: 'var(--text-primary)' }}>
                    Your Favorite Tools, Connected.
                </h2>
            </div>

            {/* Infinite Marquee */}
            <div className="relative flex overflow-hidden group">
                {/* Gradient Masks */}
                <div className="absolute top-0 left-0 w-32 h-full z-10" style={{ background: 'linear-gradient(to right, var(--bg-primary), transparent)' }} />
                <div className="absolute top-0 right-0 w-32 h-full z-10" style={{ background: 'linear-gradient(to left, var(--bg-primary), transparent)' }} />

                <motion.div 
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ ease: "linear", duration: 25, repeat: Infinity }}
                    className="flex shrink-0 gap-8 px-4"
                >
                    {[...integrations, ...integrations, ...integrations, ...integrations].map((app, i) => (
                        <div 
                            key={i} 
                            className="flex items-center gap-3 rounded-2xl px-6 py-4 min-w-[180px] shadow-sm transition-colors"
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                        >
                            <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">{app.icon}</span>
                            <span className="font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>{app.name}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
            
            <div className="text-center mt-12">
                <p className="text-sm font-['Inter']" style={{ color: 'var(--text-muted)' }}>
                    Plus open Webhooks and an extensive Developer API. <a href="#" style={{ color: 'var(--text-primary)' }} className="hover:underline">View API Docs &rarr;</a>
                </p>
            </div>
        </section>
    );
}
