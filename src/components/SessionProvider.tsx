'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useRoleStore, UserRole } from '@/stores/useRoleStore';
import { useRouter, usePathname } from 'next/navigation';

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const { setRole, logout } = useRoleStore();
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClient();

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                const publicPaths = ['/', '/login', '/customer-menu'];
                const isPublic = publicPaths.includes(pathname) || pathname.startsWith('/login/');
                if (!isPublic) {
                    router.push('/login');
                }
                logout();
                return;
            }

            // Fetch the profile 
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('role, full_name, restaurant_id')
                .eq('id', session.user.id)
                .maybeSingle();

            if (error) {
                // Ignore PGRST116 (No rows found) or 42P01 (relation "profiles" does not exist)
                const isCodeIgnored = error.code === 'PGRST116' || error.code === '42P01';
                const isMessageIgnored = error.message?.includes('schema cache') || JSON.stringify(error).includes('schema cache');
                
                if (!isCodeIgnored && !isMessageIgnored) {
                    console.error("Error fetching profile:", error.message || error);
                }
                return;
            }

            if (!profile) {
                console.warn("No profile found for user. They may need to finish onboarding.");
                return;
            }

            setRole(profile.role as UserRole, profile.full_name, profile.restaurant_id || undefined);
        };

        fetchSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event) => {
            if (_event === 'SIGNED_OUT') {
                logout();
                router.push('/login');
            } else if (_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED') {
                fetchSession();
            }
        });

        return () => {
            subscription.unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, router, setRole, logout]); // Removed supabase from dependency array to avoid infinite loop

    // We render children regardless. If they are logged out, the effect pushes them to /login
    return <>{children}</>;
}
