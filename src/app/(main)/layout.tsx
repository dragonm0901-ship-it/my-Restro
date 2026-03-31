'use client';

import { useRef, useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import CartSidebar from '@/components/cart/CartSidebar';
import { useThemeStore } from '@/stores/useThemeStore';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { useRoleStore } from '@/stores/useRoleStore';
import { useSubscriptionStore } from '@/stores/useSubscriptionStore';
import { useSync } from '@/hooks/useSync';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [cartOpen, setCartOpen] = useState(false);
    const cartRef = useRef<HTMLButtonElement>(null);
    const theme = useThemeStore((s) => s.theme);
    const collapsed = useSidebarStore((s) => s.collapsed);
    const { restaurantId } = useRoleStore();
    const { fetchSubscription } = useSubscriptionStore();
    const { syncDown } = useSync();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        const init = async () => {
            try {
                if (restaurantId) {
                    await fetchSubscription(restaurantId);
                    await syncDown();
                }
            } catch (err) {
                console.error("Layout initialization failed:", err);
            }
        };
        init();
    }, [restaurantId, fetchSubscription, syncDown]);

    return (
        <div className="flex min-h-screen max-w-[100vw] overflow-x-hidden" style={{ background: 'var(--bg-primary)' }}>
            <Sidebar />

            <div className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ${collapsed ? 'lg:ml-[60px]' : 'lg:ml-[230px]'}`}>
                <Header onCartToggle={() => setCartOpen(!cartOpen)} cartRef={cartRef} />

                <div className="flex flex-1 relative min-w-0">
                    <main className="flex-1 min-w-0 p-3 lg:p-5 pb-5 lg:pb-5">
                        {children}
                    </main>

                    <div className="hidden lg:block">
                        <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
                    </div>
                </div>
            </div>

            <div className="lg:hidden">
                <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} isMobile />
            </div>
        </div>
    );
}
