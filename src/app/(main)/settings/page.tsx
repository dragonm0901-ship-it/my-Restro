'use client';

import { motion } from 'framer-motion';
import { User as User } from '@phosphor-icons/react';
import { useThemeStore } from '@/stores/useThemeStore';

export default function SettingsPage() {
    const { theme, toggleTheme } = useThemeStore();

    const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
        <button onClick={onChange} className="relative w-11 h-6 rounded-full transition-all"
            style={{ background: value ? 'var(--text-primary)' : 'var(--bg-input)', border: `1px solid ${value ? 'var(--text-primary)' : 'var(--border)'}` }}>
            <motion.div animate={{ x: value ? 22 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-[3px] w-4 h-4 rounded-full shadow-sm" style={{ background: 'var(--bg-primary)' }} />
        </button>
    );

    return (
        <div className="space-y-6 max-w-xl page-enter pb-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Settings</h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Manage your personal preferences and account settings.</p>
            </div>

            <div className="rounded-3xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <User className="w-4 h-4" weight="fill" style={{ color: 'var(--text-muted)' }} /> Profile
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Name</label>
                        <input type="text" defaultValue="Staff User"
                            className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-shadow"
                            style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                    <div>
                        <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Email</label>
                        <input type="email" defaultValue="staff@restaurant.com"
                            className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-shadow"
                            style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                </div>
            </div>

            <div className="rounded-3xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
                <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Preferences</h3>
                <div className="space-y-5">
                    {[
                        { label: 'Dark Mode', desc: 'Toggle theme', value: theme === 'dark', onChange: toggleTheme },
                        { label: 'Notifications', desc: 'Order alerts', value: true, onChange: () => { } },
                        { label: 'Sound Effects', desc: 'Audio for new orders', value: true, onChange: () => { } },
                    ].map((pref) => (
                        <div key={pref.label} className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{pref.label}</p>
                                <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{pref.desc}</p>
                            </div>
                            <Toggle value={pref.value} onChange={pref.onChange} />
                        </div>
                    ))}
                </div>
            </div>

            <motion.button whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 font-bold rounded-xl transition-colors text-sm shadow-sm"
                style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}>Save Changes</motion.button>
        </div>
    );
}
