'use client';

import { motion } from 'framer-motion';
import { WarningCircle, SlidersHorizontal } from '@phosphor-icons/react';
import { useThemeStore } from '@/stores/useThemeStore';
import { createClient } from '@/lib/supabase';
import { localDb } from '@/lib/db/localDb';
import { useRoleStore } from '@/stores/useRoleStore';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function PreferencesSettingsPage() {
    const { theme, toggleTheme } = useThemeStore();
    const { restaurantId } = useRoleStore();
    const [isResetting, setIsResetting] = useState(false);

    const handleResetDemoData = async () => {
        if (!confirm('Are you sure you want to delete all orders? This cannot be undone.')) return;
        setIsResetting(true);
        try {
            const supabase = createClient();
            
            const { error } = await supabase.from('orders').delete().eq('restaurant_id', restaurantId);
            if (error) throw error;
            
            await localDb.sync_queue.clear();
            
            toast.success('Demo data reset successfully!');
        } catch (err) {
            console.error('Reset failed:', err);
            toast.error('Failed to reset demo data');
        } finally {
            setIsResetting(false);
        }
    };

    const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
        <button onClick={onChange} className="relative w-11 h-6 rounded-full transition-all"
            style={{ background: value ? 'var(--text-primary)' : 'var(--bg-input)', border: `1px solid ${value ? 'var(--text-primary)' : 'var(--border)'}` }}>
            <motion.div animate={{ x: value ? 22 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-[3px] w-4 h-4 rounded-full shadow-sm" style={{ background: 'var(--bg-primary)' }} />
        </button>
    );

    return (
        <div className="space-y-6 max-w-xl page-enter">
            <div>
                <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Preferences</h2>
                <p className="text-[13px] mt-1" style={{ color: 'var(--text-secondary)' }}>App functionality and danger zone.</p>
            </div>

            <div className="rounded-3xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <SlidersHorizontal className="w-4 h-4" weight="fill" style={{ color: 'var(--text-muted)' }} /> App Preferences
                </h3>
                <div className="space-y-5">
                    {[
                        { label: 'Dark Mode', desc: 'Toggle theme', value: theme === 'dark', onChange: toggleTheme },
                        { label: 'Notifications', desc: 'Order alerts', value: true, onChange: () => { } },
                        { label: 'Sound Effects', desc: 'Audio for new orders', value: true, onChange: () => { } },
                    ].map((pref) => (
                        <div key={pref.label} className="flex items-center justify-between py-2 border-b last:border-b-0 border-dashed" style={{ borderColor: 'var(--border)' }}>
                            <div>
                                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{pref.label}</p>
                                <p className="text-[11px] font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>{pref.desc}</p>
                            </div>
                            <Toggle value={pref.value} onChange={pref.onChange} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Developer / Demo Actions */}
            <div className="rounded-3xl p-6 border border-red-500/20" style={{ background: 'var(--bg-card)' }}>
                <h3 className="text-sm font-bold mb-4 flex gap-2 items-center text-red-500">
                    <WarningCircle className="w-4 h-4" weight="fill" /> Danger Zone
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold flex gap-2" style={{ color: 'var(--text-primary)' }}>
                            Reset Demo Data
                            <span className="text-[8px] bg-red-100/10 text-red-500 px-1.5 py-0.5 rounded uppercase tracking-wider">Irreversible</span>
                        </p>
                        <p className="text-[11px] font-medium mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>Deletes all orders and transactions from your restaurant and clears the sync queue.</p>
                    </div>
                    <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={handleResetDemoData}
                        disabled={isResetting}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                        {isResetting ? 'Wiping...' : 'Wipe Orders'}
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
