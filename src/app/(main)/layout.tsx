'use client';

import { useRef, useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import CartSidebar from '@/components/cart/CartSidebar';
import { useThemeStore } from '@/stores/useThemeStore';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { useRoleStore } from '@/stores/useRoleStore';
import { useSubscriptionStore } from '@/stores/useSubscriptionStore';

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

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        if (restaurantId) {
            fetchSubscription(restaurantId);
        }
    }, [restaurantId, fetchSubscription]);

    return (
        <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
            <Sidebar />

            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${collapsed ? 'lg:ml-[60px]' : 'lg:ml-[230px]'}`}>
                <Header onCartToggle={() => setCartOpen(!cartOpen)} cartRef={cartRef} />

                <div className="flex flex-1 relative">
                    <main className="flex-1 p-3 lg:p-5 pb-20 lg:pb-5">
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
