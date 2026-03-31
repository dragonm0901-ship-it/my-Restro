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
    Package as Package,
    Wallet as Wallet,
    UserCircle as UserCircle,
    ShoppingCart as ShoppingCart,
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
    const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen } = useSidebarStore();
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
    }).filter((g) => {
        if (!role) return true; // Show all if no role (loading)
        // Admin/Owner can see everything. Others are filtered.
        if (role === 'owner' || role === 'admin') return true;
        return g.roles.includes(role);
    });

    const toggleGroup = (label: string) => {
        setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
    };

    const isGroupActive = (group: NavGroup) => {
        if (group.href) return pathname === group.href || pathname.startsWith(group.href + '/');
        return group.children?.some((c) => pathname === c.href || pathname.startsWith(c.href + '/')) || false;
    };

    const handleSignOut = async () => {
        try {
            const { createClient } = await import('@/lib/supabase');
            const supabase = createClient();
            await supabase.auth.signOut();
        } catch (err) {
            console.warn("Sign out handling:", err);
        } finally {
            logout();
            toast.success('Signed out');
            router.push('/login');
        }
    };

    const sidebarWidth = collapsed ? 60 : 230;

    // Shared sidebar content renderer
    const renderSidebarContent = (isMobileContext: boolean) => (
        <div className="flex flex-col w-full h-full overflow-hidden">
            {/* Logo */}
            <div className={`flex items-center h-[80px] shrink-0 justify-between ${collapsed && !isMobileContext ? 'justify-center w-full' : 'px-5'}`}>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--accent)' }}>
                        <LogoIcon size={20} className="text-(--accent-fg)" />
                    </div>
                    {(!collapsed || isMobileContext) && (
                        <span
                            className="text-[17px] font-bold whitespace-nowrap overflow-hidden text-ellipsis font-['Outfit'] tracking-tight pb-[2px]"
                            style={{ color: 'var(--text-primary)' }}
                        >myRestro Manager</span>
                    )}
                </div>
                {isMobileContext && (
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="p-2 rounded-lg transition-colors flex items-center justify-center"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
                    </button>
                )}
            </div>

            {/* Nav */}
            <nav className={`flex-1 py-4 space-y-2 overflow-y-auto hide-scrollbar ${collapsed && !isMobileContext ? 'px-1.5' : 'px-4'}`}>
                {filteredGroups.map((group) => {
                    const active = isGroupActive(group);
                    const isOpen = openGroups[group.label];
                    const hasChildren = group.children && group.children.length > 0;
                    const showLabels = !collapsed || isMobileContext;

                    // Direct link (no children)
                    if (group.href && !hasChildren) {
                        return (
                            <Link key={group.label} href={group.href} className="block w-full" onClick={() => isMobileContext && setMobileOpen(false)}>
                                <div
                                    className={`flex items-center w-full py-3 rounded-xl transition-colors relative ${!showLabels ? 'justify-center' : 'gap-3.5 px-3'}`}
                                    style={{
                                        background: active ? 'var(--accent)' : 'transparent',
                                        color: active ? 'var(--accent-fg)' : 'var(--text-secondary)',
                                    }}
                                    title={!showLabels ? group.label : undefined}
                                >
                                    <group.icon className="w-5 h-5 shrink-0" weight={active ? "fill" : "regular"} />
                                    {showLabels && (
                                        <span className="text-sm font-medium whitespace-nowrap flex-1">{group.label}</span>
                                    )}
                                    {showLabels && group.label === 'Customers' && (
                                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}>2</div>
                                    )}
                                </div>
                            </Link>
                        );
                    }

                    // Group with children
                    return (
                        <div key={group.label}>
                            <button
                                onClick={() => {
                                    if (!showLabels && group.children?.length) {
                                        router.push(group.children[0].href);
                                        if (isMobileContext) setMobileOpen(false);
                                    } else {
                                        toggleGroup(group.label);
                                    }
                                }}
                                className={`flex items-center w-full py-3 rounded-xl transition-colors ${!showLabels ? 'justify-center' : 'gap-3.5 px-3'}`}
                                style={{ color: active ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                                title={!showLabels ? group.label : undefined}
                            >
                                <group.icon className="w-5 h-5 shrink-0" weight={active ? "fill" : "regular"} />
                                {showLabels && (
                                    <>
                                        <span className="text-sm font-medium whitespace-nowrap flex-1 text-left">{group.label}</span>
                                        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.15 }}>
                                            <ChevronDown className="w-4 h-4 opacity-40" weight="bold" />
                                        </motion.div>
                                    </>
                                )}
                            </button>
                            <AnimatePresence>
                                {showLabels && isOpen && group.children && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="ml-[22px] pl-2.5 space-y-0.5" style={{ borderLeft: '1px solid var(--border)' }}>
                                            {group.children.map((child) => {
                                                const childActive = pathname === child.href;
                                                return (
                                                    <Link key={child.href} href={child.href} onClick={() => isMobileContext && setMobileOpen(false)}>
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
            <div className={`${collapsed && !isMobileContext ? 'px-1.5' : 'px-4'} pb-8 mt-4`}>
                <button
                    onClick={handleSignOut}
                    className={`flex items-center w-full py-3 rounded-xl transition-all font-medium ${collapsed && !isMobileContext ? 'justify-center' : 'justify-start gap-3 px-2'}`}
                    style={{ color: 'var(--text-secondary)' }}
                >
                    <LogOut className="w-5 h-5 shrink-0" weight="regular" />
                    {(!collapsed || isMobileContext) && (
                        <span className="text-sm whitespace-nowrap overflow-hidden">Log Out</span>
                    )}
                </button>
            </div>

            {/* Upgrade Plan */}
            {role === 'owner' && (!collapsed || isMobileContext) && (
                <Link href="/pricing" className="px-2 pb-3 block" onClick={() => isMobileContext && setMobileOpen(false)}>
                    <div
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
                    </div>
                </Link>
            )}
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar — always rendered, never removed from DOM */}
            <motion.div
                animate={{ width: sidebarWidth }}
                transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
                className="hidden lg:flex fixed left-0 top-0 h-screen z-40 overflow-visible flex-col"
                style={{
                    background: 'var(--bg-secondary)',
                    borderRight: '1px solid var(--border)'
                }}
            >
                {renderSidebarContent(false)}

                {/* Collapse Toggle */}
                <button
                    onClick={toggleCollapsed}
                    className="absolute -right-3 top-4 w-6 h-6 rounded-full flex items-center justify-center border shadow-sm z-50 transition-colors"
                    style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                >
                    {collapsed ? <ChevronRight className="w-3 h-3" weight="bold" /> : <ChevronLeft className="w-3 h-3" weight="bold" />}
                </button>
            </motion.div>

            {/* Mobile Sidebar — overlay, only when mobileOpen */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
                            className="fixed left-0 top-0 h-screen z-50 flex flex-col lg:hidden"
                            style={{
                                width: '85%',
                                maxWidth: 320,
                                background: 'var(--bg-secondary)',
                                borderRight: '1px solid var(--border)'
                            }}
                        >
                            {renderSidebarContent(true)}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
