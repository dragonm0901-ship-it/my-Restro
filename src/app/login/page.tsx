'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LockKey as Lock,
    EnvelopeSimple as Mail,
    ArrowRight as ArrowRight,
    CircleNotch as Loader2,
    Eye as Eye,
    EyeClosed as EyeOff,
    ForkKnife as UtensilsCrossed,
    User as User
} from '@phosphor-icons/react';
import { LogoIcon } from '@/components/Logo';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useRoleStore, UserRole } from '@/stores/useRoleStore';

type AuthMode = 'signin' | 'signup';

export default function LoginPage() {
    const [mode, setMode] = useState<AuthMode>('signin');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ email: '', password: '', fullName: '', restaurantName: '' });
    const [selectedRole, setSelectedRole] = useState<UserRole>('owner');
    const router = useRouter();
    const supabase = createClient();
    const { setRole } = useRoleStore();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === 'signup') {
                if (!form.email || !form.password || !form.fullName || !form.restaurantName) {
                    throw new Error('Please fill in all fields');
                }

                // 1. Sign up the user (triggers handle_new_user which makes them 'admin' with null restaurant_id)
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: form.email,
                    password: form.password,
                    options: {
                        data: {
                            full_name: form.fullName,
                        },
                    },
                });

                if (authError) throw authError;

                if (authData.user) {
                    // 2. Call the RPC function to create the restaurant and link the user
                    const { error: rpcError } = await supabase.rpc('create_restaurant_and_link', {
                        restaurant_name: form.restaurantName
                    });

                    if (rpcError) throw rpcError;

                    toast.success('Restaurant created successfully! Welcome owner.');
                    router.push('/dashboard');
                }

            } else {
                if (!form.email || !form.password) {
                    throw new Error('Please enter email and password');
                }

                const { error, data } = await supabase.auth.signInWithPassword({
                    email: form.email,
                    password: form.password,
                });

                if (error) throw error;

                // Fetch profile to get restaurantId
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('restaurant_id')
                    .eq('id', data.user.id)
                    .maybeSingle();

                // Set role in store based on selection
                setRole(selectedRole, data.user?.user_metadata?.full_name || undefined, profile?.restaurant_id);

                toast.success('Welcome back!');
                // Route them based on their profile role
                if (selectedRole === 'chef') {
                    router.push('/kds');
                } else if (selectedRole === 'waiter') {
                    router.push('/tables');
                } else {
                    router.push('/dashboard');
                }
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--text-primary) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-[380px] relative z-10"
            >
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <motion.div
                        initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                        style={{ background: 'var(--accent)', boxShadow: '0 8px 32px -8px var(--accent)' }}
                    >
                        <LogoIcon size={32} className="text-(--accent-fg)" />
                    </motion.div>
                    <h1 className="text-2xl font-bold font-['Outfit'] tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>
                        myRestro Manager
                    </h1>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {mode === 'signin' ? 'Sign in to your restaurant' : 'Register your new restaurant'}
                    </p>
                </div>

                {/* Main Card */}
                <div className="rounded-2xl p-6 shadow-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>


                    {/* Mode is toggled at the bottom now */}


                    <form onSubmit={handleAuth} className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {mode === 'signup' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-4"
                                >
                                    <div className="relative">
                                        <UtensilsCrossed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" weight="fill" style={{ color: 'var(--text-muted)' }} />
                                        <input
                                            type="text"
                                            placeholder="Restaurant Name"
                                            value={form.restaurantName}
                                            onChange={(e) => setForm({ ...form, restaurantName: e.target.value })}
                                            className="w-full rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all"
                                            style={{
                                                background: 'var(--bg-input)', border: '1px solid var(--border)',
                                                color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent-light)',
                                            } as React.CSSProperties}
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" weight="fill" style={{ color: 'var(--text-muted)' }} />
                                        <input
                                            type="text"
                                            placeholder="Your Full Name"
                                            value={form.fullName}
                                            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                            className="w-full rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all"
                                            style={{
                                                background: 'var(--bg-input)', border: '1px solid var(--border)',
                                                color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent-light)',
                                            } as React.CSSProperties}
                                            disabled={loading}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" weight="fill" style={{ color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all"
                                style={{
                                    background: 'var(--bg-input)', border: '1px solid var(--border)',
                                    color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent-light)',
                                } as React.CSSProperties}
                                disabled={loading}
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" weight="fill" style={{ color: 'var(--text-muted)' }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 transition-all"
                                style={{
                                    background: 'var(--bg-input)', border: '1px solid var(--border)',
                                    color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent-light)',
                                } as React.CSSProperties}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                style={{ color: 'var(--text-muted)' }}
                                disabled={loading}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" weight="bold" /> : <Eye className="w-4 h-4" weight="bold" />}
                            </button>
                        </div>

                        <AnimatePresence mode="popLayout">
                            {mode === 'signin' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="pt-1"
                                >
                                    <p className="text-[10px] font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Login As</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['owner', 'chef', 'waiter'] as UserRole[]).map((r) => {
                                            const isSelected = selectedRole === r;
                                            return (
                                                <button
                                                    key={r}
                                                    type="button"
                                                    onClick={() => setSelectedRole(r)}
                                                    className={`py-2 px-1 rounded-lg text-[11px] font-bold transition-all border ${isSelected ? 'shadow-sm' : ''}`}
                                                    style={{
                                                        background: isSelected ? 'var(--bg-card)' : 'transparent',
                                                        borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                                                        color: isSelected ? 'var(--accent)' : 'var(--text-secondary)'
                                                    }}
                                                >
                                                    {r === 'owner' ? 'Manager' : r === 'chef' ? 'Kitchen' : 'Staff'}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            type="submit"
                            disabled={loading || (!form.email || !form.password || (mode === 'signup' && (!form.restaurantName || !form.fullName)))}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 mt-4 font-bold rounded-xl flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                background: 'var(--accent)',
                                color: 'var(--accent-fg)',
                                boxShadow: '0 4px 14px -6px var(--accent)'
                            }}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    <span>{mode === 'signin' ? 'Sign In' : 'Create Restaurant'}</span>
                                    <ArrowRight className="w-4 h-4" weight="bold" />
                                </>
                            )}
                        </motion.button>

                        <div className="pt-4 text-center text-xs">
                            {mode === 'signin' ? (
                                <p style={{ color: 'var(--text-muted)' }}>
                                    Building a new restaurant?{' '}
                                    <button type="button" onClick={() => setMode('signup')} style={{ color: 'var(--accent)' }} className="font-bold hover:underline transition-all">Sign Up / Register</button>
                                </p>
                            ) : (
                                <p style={{ color: 'var(--text-muted)' }}>
                                    Already have a restaurant?{' '}
                                    <button type="button" onClick={() => setMode('signin')} style={{ color: 'var(--accent)' }} className="font-bold hover:underline transition-all">Log In</button>
                                </p>
                            )}
                        </div>
                    </form>

                    {/* Demo Login Options */}
                    <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                        <p className="text-xs text-center font-medium mb-4" style={{ color: 'var(--text-muted)' }}>
                            Quick Demo Access
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {(['owner', 'chef', 'waiter'] as UserRole[]).map((r) => (
                                <button
                                    key={`demo-${r}`}
                                    type="button"
                                    onClick={async () => {
                                        setLoading(true);
                                        try {
                                            const email = `demo.${r}@example.com`;
                                            const password = 'Password123!';
                                            let { error, data } = await supabase.auth.signInWithPassword({ email, password });

                                            if (error && error.message.includes('Invalid login credentials')) {
                                                const { error: signUpError } = await supabase.auth.signUp({
                                                    email, password, options: { data: { full_name: `Demo ${r.charAt(0).toUpperCase() + r.slice(1)}` } }
                                                });
                                                if (signUpError) throw signUpError;

                                                if (r === 'owner') {
                                                    await supabase.rpc('create_restaurant_and_link', { restaurant_name: 'Demo Restaurant' });
                                                } else {
                                                    // For demo chef/waiter, try to link them to an existing demo restaurant
                                                    const { data: demoRestro } = await supabase.from('restaurants').select('id').ilike('name', 'Demo Restaurant').limit(1).maybeSingle();
                                                    if (demoRestro) {
                                                        const dbRole = r === 'chef' ? 'kitchen' : (r === 'waiter' ? 'staff' : 'admin');
                                                        await supabase.from('profiles').insert({
                                                            id: signUpError ? undefined : (await supabase.auth.getUser()).data.user?.id,
                                                            restaurant_id: demoRestro.id,
                                                            role: dbRole,
                                                            full_name: `Demo ${r}`
                                                        });
                                                    }
                                                }
                                                const retry = await supabase.auth.signInWithPassword({ email, password });
                                                error = retry.error;
                                                data = retry.data;
                                            }
                                            if (error) throw error;

                                            let { data: profile } = await supabase
                                                .from('profiles')
                                                .select('restaurant_id, role')
                                                .eq('id', data.user?.id)
                                                .maybeSingle();

                                            // Auto-repair demo profiles if the postgres trigger gave them 'admin' or null restaurant_id
                                            const expectedDbRole = r === 'chef' ? 'kitchen' : (r === 'waiter' ? 'staff' : 'admin');
                                            if ((!profile || profile.role !== expectedDbRole || !profile.restaurant_id) && r !== 'owner') {
                                                const { data: demoRestro } = await supabase.from('restaurants').select('id').ilike('name', 'Demo Restaurant').limit(1).maybeSingle();
                                                if (demoRestro) {
                                                    const { error: updateErr } = await supabase.from('profiles').update({
                                                        restaurant_id: demoRestro.id,
                                                        role: expectedDbRole,
                                                        full_name: `Demo ${r}`
                                                    }).eq('id', data.user?.id);
                                                    
                                                    if (updateErr) console.error("Profile update failed:", updateErr);
                                                    
                                                    const { data: newProfile } = await supabase.from('profiles').select('restaurant_id, role').eq('id', data.user?.id).maybeSingle();
                                                    profile = newProfile;
                                                }
                                            }

                                            setRole(r, data.user?.user_metadata?.full_name, profile?.restaurant_id);
                                            toast.success(`Logged in as Demo ${r}`);

                                            if (r === 'chef') router.push('/kds');
                                            else if (r === 'waiter') router.push('/tables');
                                            else router.push('/dashboard');
                                        } catch (err) {
                                            toast.error(err instanceof Error ? err.message : 'Demo setup failed');
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    disabled={loading}
                                    className="py-2 px-1 rounded-lg text-[10px] font-bold transition-all border hover:bg-black/5 dark:hover:bg-white/5"
                                    style={{
                                        borderColor: 'var(--border)',
                                        color: 'var(--text-secondary)'
                                    }}
                                >
                                    {r === 'owner' ? 'Owner Setup' : r === 'chef' ? 'Chef Demo' : 'Waiter Demo'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
