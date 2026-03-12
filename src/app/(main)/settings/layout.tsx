'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, SlidersHorizontal, GridFour, Receipt } from '@phosphor-icons/react';

const tabs = [
    { name: 'Profile', href: '/settings/profile', icon: User },
    { name: 'Preferences', href: '/settings/preferences', icon: SlidersHorizontal },
    { name: 'Floorplan & Rooms', href: '/settings/floorplan', icon: GridFour },
    { name: 'Billing', href: '/settings/billing', icon: Receipt },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto page-enter pb-8">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 shrink-0">
                <div className="sticky top-24">
                    <h1 className="text-2xl font-bold tracking-tight mb-6" style={{ color: 'var(--text-primary)' }}>Settings</h1>
                    <nav className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                        {tabs.map((tab) => {
                            const isActive = pathname === tab.href;
                            const Icon = tab.icon;
                            return (
                                <Link key={tab.name} href={tab.href} className="shrink-0 md:shrink">
                                    <div
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative"
                                        style={{
                                            background: isActive ? 'var(--accent)' : 'transparent',
                                            color: isActive ? 'var(--accent-fg)' : 'var(--text-secondary)',
                                        }}
                                    >
                                        <Icon className="w-5 h-5" weight={isActive ? 'fill' : 'regular'} />
                                        <span className="text-sm font-bold whitespace-nowrap">{tab.name}</span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 rounded-xl"
                                                style={{ border: '1px solid var(--accent)', opacity: 0.5 }}
                                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                            />
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 min-w-0">
                {children}
            </main>
        </div>
    );
}
