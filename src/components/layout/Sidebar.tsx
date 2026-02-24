'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    SquaresFour as LayoutDashboard,
    ForkKnife as UtensilsCrossed,
    Users as Users,
    Gear as Settings,
    ChefHat as ChefHat,
    SignOut as LogOut,
    CaretLeft as ChevronLeft,
    CaretRight as ChevronRight,
    CaretDown as ChevronDown,
    GridFour as LayoutGrid,
    Package as Package,
    Wallet as Wallet,
    UserCircle as UserCircle,
    ShoppingCart as ShoppingCart,
    Sparkle as Sparkles,
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { useRoleStore } from '@/stores/useRoleStore';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { useSubscriptionStore } from '@/stores/useSubscriptionStore';
import { useState } from 'react';
import { LogoIcon } from '@/components/Logo';

type NavChild = { label: string; href: string, isPremium?: boolean };

interface NavGroup {
    label: string;
    icon: React.ElementType;
    roles: string[];
    href?: string; // direct link (no children)
    children?: NavChild[];
}

const navGroups: NavGroup[] = [
    { label: 'Dashboard', icon: LayoutDashboard, roles: ['owner'], href: '/dashboard' },
    {
        label: 'Orders', icon: ShoppingCart, roles: ['owner', 'waiter'],
        children: [
            { label: 'POS Terminal', href: '/pos' },
            { label: 'Tables', href: '/tables' },
            { label: 'KDS', href: '/kds', isPremium: true },
        ],
    },
    {
        label: 'Menu', icon: UtensilsCrossed, roles: ['owner'],
        children: [
            { label: 'Dishes', href: '/menu' },
            { label: 'Categories', href: '/categories' },
            { label: 'QR Builder', href: '/qr-menu' },
        ],
    },
    {
        label: 'Finance', icon: Wallet, roles: ['owner'],
        children: [
            { label: 'Billing / Invoices', href: '/billing' },
            { label: 'Subscription', href: '/settings/billing' },
            { label: 'Reports', href: '/reports', isPremium: true },
            { label: 'Transactions', href: '/transactions', isPremium: true },
        ],
    },
    {
        label: 'Inventory', icon: Package, roles: ['owner'],
        children: [
            { label: 'All Stock', href: '/inventory' },
            { label: 'Suppliers', href: '/suppliers' },
            { label: 'Menu Analytics', href: '/menu-engineering', isPremium: true },
        ],
    },
    {
        label: 'Engagement', icon: UserCircle, roles: ['owner'],
        children: [
            { label: 'Customers', href: '/customers' },
            { label: 'Waitlist', href: '/waitlist' },
            { label: 'Marketing CRM', href: '/marketing', isPremium: true },
        ],
    },
    { label: 'Staff', icon: Users, roles: ['owner'], href: '/staff' },
    { label: 'KDS Monitor', icon: ChefHat, roles: ['chef'], href: '/kds' },
    { label: 'Settings', icon: Settings, roles: ['owner', 'waiter', 'chef'], href: '/settings' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { role, logout } = useRoleStore();
    const { collapsed, toggleCollapsed } = useSidebarStore();
    const { subscription } = useSubscriptionStore();
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ Orders: true });

    const hasPremium = subscription?.limits?.hasPrioritySupport || false;

    const filteredGroups = navGroups.map(g => {
        if (!g.children) return g;
        // Filter out premium children if the user doesn't have premium
        return {
            ...g,
            children: g.children.filter(c => !c.isPremium || hasPremium)
        };
    }).filter((g) => !role || g.roles.includes(role));

    const toggleGroup = (label: string) => {
        setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
    };

    const isGroupActive = (group: NavGroup) => {
        if (group.href) return pathname === group.href;
        return group.children?.some((c) => pathname === c.href || pathname.startsWith(c.href + '/')) || false;
    };

    const handleSignOut = async () => {
        const { createClient } = await import('@/lib/supabase');
        const supabase = createClient();
        await supabase.auth.signOut();
        logout();
        toast.success('Signed out');
        router.push('/login');
    };

    const sidebarWidth = collapsed ? 60 : 230;

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside
                animate={{ width: sidebarWidth }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="hidden lg:flex flex-col fixed left-0 top-0 h-screen z-40 overflow-visible"
                style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}
            >
                <div className="flex flex-col w-full h-full overflow-hidden">
                    {/* Logo */}
                    <div className={`flex items-center h-[80px] shrink-0 ${collapsed ? 'justify-center w-full' : 'gap-3 px-6'}`}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--accent)' }}>
                            <LogoIcon size={20} className="text-(--accent-fg)" />
                        </div>
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.span
                                    initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}
                                    className="text-xl font-bold whitespace-nowrap overflow-hidden font-['Outfit']"
                                    style={{ color: 'var(--text-primary)' }}
                                >myRestro</motion.span>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Nav */}
                    <nav className={`flex-1 py-4 space-y-2 overflow-y-auto hide-scrollbar ${collapsed ? 'px-1.5' : 'px-4'}`}>
                        {filteredGroups.map((group) => {
                            const active = isGroupActive(group);
                            const isOpen = openGroups[group.label];
                            const hasChildren = group.children && group.children.length > 0;

                            // Direct link (no children)
                            if (group.href && !hasChildren) {
                                return (
                                    <Link key={group.label} href={group.href} className="block w-full">
                                        <motion.div
                                            whileTap={{ scale: 0.97 }}
                                            className={`flex items-center w-full py-3 rounded-xl transition-colors relative ${collapsed ? 'justify-center' : 'gap-3.5 px-3'}`}
                                            style={{
                                                background: active ? 'var(--accent)' : 'transparent',
                                                color: active ? 'var(--accent-fg)' : 'var(--text-secondary)',
                                            }}
                                            title={collapsed ? group.label : undefined}
                                        >
                                            <group.icon className="w-5 h-5 shrink-0" weight={active ? "fill" : "regular"} />
                                            <AnimatePresence>
                                                {!collapsed && (
                                                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                        className="text-sm font-medium whitespace-nowrap flex-1">{group.label}</motion.span>
                                                )}
                                            </AnimatePresence>
                                            {/* Messages Badge (Mock) */}
                                            {!collapsed && group.label === 'Customers' && (
                                                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}>2</div>
                                            )}
                                        </motion.div>
                                    </Link>
                                );
                            }

                            // Group with children
                            return (
                                <div key={group.label}>
                                    <button
                                        onClick={() => {
                                            if (collapsed && group.children?.length) {
                                                router.push(group.children[0].href);
                                            } else {
                                                toggleGroup(group.label);
                                            }
                                        }}
                                        className={`flex items-center w-full py-3 rounded-xl transition-colors ${collapsed ? 'justify-center' : 'gap-3.5 px-3'}`}
                                        style={{ color: active ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                                        title={collapsed ? group.label : undefined}
                                    >
                                        <group.icon className="w-5 h-5 shrink-0" weight={active ? "fill" : "regular"} />
                                        {!collapsed && (
                                            <>
                                                <span className="text-sm font-medium whitespace-nowrap flex-1 text-left">{group.label}</span>
                                                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.15 }}>
                                                    <ChevronDown className="w-4 h-4 opacity-40" weight="bold" />
                                                </motion.div>
                                            </>
                                        )}
                                    </button>
                                    <AnimatePresence>
                                        {!collapsed && isOpen && group.children && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.15 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="ml-[22px] pl-2.5 space-y-0.5" style={{ borderLeft: '1px solid var(--border)' }}>
                                                    {group.children.map((child) => {
                                                        const childActive = pathname === child.href;
                                                        return (
                                                            <Link key={child.href} href={child.href}>
                                                                <div
                                                                    className="px-2 py-[5px] rounded-md text-[11px] font-medium transition-colors"
                                                                    style={{
                                                                        background: childActive ? 'var(--accent-light)' : 'transparent',
                                                                        color: childActive ? 'var(--accent-text)' : 'var(--text-muted)',
                                                                    }}
                                                                >{child.label}</div>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </nav>

                    {/* Sign Out */}
                    <div className={`${collapsed ? 'px-1.5' : 'px-4'} pb-8 mt-4`}>
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSignOut}
                            className={`flex items-center w-full py-3 rounded-xl transition-all font-medium ${collapsed ? 'justify-center' : 'justify-start gap-3 px-2'}`}
                            style={{
                                color: 'var(--text-secondary)',
                            }}
                        >
                            <LogOut className="w-5 h-5 shrink-0" weight="regular" />
                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}
                                        className="text-sm whitespace-nowrap overflow-hidden">Log Out</motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>

                    {/* Upgrade Plan */}
                    <AnimatePresence>
                        {role === 'owner' && !collapsed && (
                            <Link href="/pricing" className="px-2 pb-3 hidden lg:block">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl transition-all relative overflow-hidden group border"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
                                        borderColor: 'rgba(139,92,246,0.2)',
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                    <div className="flex-1 flex items-center justify-between min-w-0">
                                        <span className="text-[12px] font-bold whitespace-nowrap">Upgrade Plan</span>
                                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-white/10" style={{ color: '#8b5cf6' }}>Pro</span>
                                    </div>
                                </motion.div>
                            </Link>
                        )}
                    </AnimatePresence>
                </div>

                {/* Collapse Toggle - Outside overflow-hidden wrapper, inside overflow-visible aside */}
                <button
                    onClick={toggleCollapsed}
                    className="absolute -right-3 top-4 w-6 h-6 rounded-full flex items-center justify-center border shadow-sm z-50 transition-colors hidden lg:flex"
                    style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                >
                    {collapsed ? <ChevronRight className="w-3 h-3" weight="bold" /> : <ChevronLeft className="w-3 h-3" weight="bold" />}
                </button>
            </motion.aside>

            {/* Mobile Bottom Bar */}
            <nav
                className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-1 py-1 mobile-nav-safe"
                style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}
            >
                <div className="flex justify-around items-center">
                    {[
                        { label: 'Menu', href: '/menu', icon: UtensilsCrossed },
                        { label: 'Tables', href: '/tables', icon: LayoutGrid },
                        { label: 'KDS', href: '/kds', icon: ChefHat },
                        { label: 'Settings', href: '/settings', icon: Settings },
                    ].slice(0, 4).map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <motion.div
                                    whileTap={{ scale: 0.85 }}
                                    className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors"
                                    style={{ color: isActive ? 'var(--accent-text)' : 'var(--text-muted)' }}
                                >
                                    <item.icon className="w-4 h-4" weight="fill" />
                                    <span className="text-[9px] font-medium">{item.label}</span>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
