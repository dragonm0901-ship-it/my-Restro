'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, FloppyDisk } from '@phosphor-icons/react';
import { useRoleStore } from '@/stores/useRoleStore';
import { createClient } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function ProfileSettingsPage() {
    const { role, userName } = useRoleStore();
    const [name, setName] = useState(userName || 'David Spade');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const supabase = createClient();
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (!user || authError) {
                toast.error('Not authenticated');
                return;
            }

            const { error } = await supabase
                .from('profiles')
                .update({ full_name: name })
                .eq('id', user.id);

            if (error) throw error;

            useRoleStore.getState().setRole(role!, name, useRoleStore.getState().restaurantId);
            toast.success('Profile saved!');
        } catch (err: unknown) {
            console.error('Save failed:', err);
            toast.error(err instanceof Error ? err.message : 'Failed to save profile');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 max-w-xl page-enter">
            <div>
                <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Profile</h2>
                <p className="text-[13px] mt-1" style={{ color: 'var(--text-secondary)' }}>Manage your personal account details.</p>
            </div>

            <div className="rounded-3xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <User className="w-4 h-4" weight="fill" style={{ color: 'var(--text-muted)' }} /> Personal Details
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-shadow"
                            style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                    <div>
                        <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Email</label>
                        <input type="email" defaultValue={`${role || 'staff'}@restaurant.com`} readOnly
                            className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-shadow opacity-60 cursor-not-allowed"
                            style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                    <div>
                        <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Role</label>
                        <input type="text" value={(role || 'waiter').toUpperCase()} readOnly
                            className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none font-bold opacity-60 cursor-not-allowed"
                            style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--accent-text)' }} />
                    </div>
                </div>
            </div>

            <motion.button whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-3.5 font-bold rounded-xl transition-colors text-sm shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
                <FloppyDisk className="w-4 h-4" weight="bold" />
                {isSaving ? 'Saving...' : 'Save Profile'}
            </motion.button>
        </div>
    );
}
