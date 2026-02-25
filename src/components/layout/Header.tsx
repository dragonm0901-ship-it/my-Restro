'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MagnifyingGlass as Search,
    ShoppingBag as ShoppingBag,
    Bell as Bell,
    User as User,
    Sun as Sun,
    Moon as Moon
} from '@phosphor-icons/react';
import { useCartStore } from '@/stores/useCartStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { useRoleStore } from '@/stores/useRoleStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { LogoIcon } from '@/components/Logo';

/* eslint-disable react-hooks/purity */

interface HeaderProps {
    onCartToggle?: () => void;
    cartRef?: React.RefObject<HTMLButtonElement | null>;
}

export default function Header({ onCartToggle, cartRef }: HeaderProps) {
    const itemCount = useCartStore((s) => s.getItemCount());
    const tableNumber = useCartStore((s) => s.tableNumber);
    const { theme, toggleTheme } = useThemeStore();
    const role = useRoleStore((s) => s.role);
    const userName = useRoleStore((s) => s.userName);
    const { notifications, markRead, markAllRead, getUnreadCount } = useNotificationStore();
    const { toggleMobile } = useSidebarStore();
    const [showNotifs, setShowNotifs] = useState(false);

    const unreadCount = getUnreadCount(role || 'all');
    const myNotifs = notifications.filter(
        (n) => n.forRole === role || n.forRole === 'all'
    ).slice(0, 15);

    const getTimeSince = (iso: string) => {
        const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
        if (m < 1) return 'now';
        if (m < 60) return `${m}m`;
        return `${Math.floor(m / 60)}h`;
    };

    return (
        <header
            className="sticky top-0 z-30"
            style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}
        >
            <div className="flex items-center justify-between h-[56px] px-4 lg:px-5">
                {/* Left */}
                <div className="flex items-center gap-2.5 flex-1">
                    {/* Mobile Menu & Logo */}
                    <div className="lg:hidden flex items-center shrink-0 mr-1 gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--accent)' }}>
                            <LogoIcon size={20} className="text-(--accent-fg)" />
                        </div>
                        <button
                            onClick={toggleMobile}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path></svg>
                        </button>
                    </div>
                    {tableNumber && (
                        <div
                            className="hidden sm:flex items-center px-2 py-1 rounded text-[10px] font-semibold shrink-0"
                            style={{ background: 'var(--accent-light)', color: 'var(--accent-text)' }}
                        >
                            Table {tableNumber}
                        </div>
                    )}
                    <div className="relative flex-1 max-w-md hidden sm:block">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                            type="text" placeholder="Tap to search"
                            className="w-full rounded-2xl pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all placeholder:text-gray-400"
                            style={{
                                background: 'var(--bg-card)',
                                color: 'var(--text-primary)',
                            }}
                        />
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-1 ml-2">
                    <motion.button whileTap={{ scale: 0.9 }} onClick={toggleTheme}
                        className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-secondary)' }}
                    >
                        {theme === 'dark' ? <Sun className="w-4 h-4" weight="fill" /> : <Moon className="w-4 h-4" weight="fill" />}
                    </motion.button>

                    {/* Notifications */}
                    <div className="relative">
                        <motion.button whileTap={{ scale: 0.9 }}
                            onClick={() => setShowNotifs(!showNotifs)}
                            className="relative p-2.5 rounded-full transition-colors flex items-center justify-center border-none" style={{ color: 'var(--text-secondary)', background: 'transparent' }}
                        >
                            <Bell className="w-5 h-5" weight="regular" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] text-[8px] font-bold rounded-full flex items-center justify-center px-0.5"
                                    style={{ background: 'var(--danger)', color: '#fff' }}>
                                    {unreadCount}
                                </span>
                            )}
                        </motion.button>

                        <AnimatePresence>
                            {showNotifs && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        onClick={() => setShowNotifs(false)}
                                        className="fixed inset-0 z-40"
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-10 w-72 max-h-80 rounded-xl overflow-hidden z-50 shadow-xl"
                                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                                    >
                                        <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                                            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                                                Notifications
                                            </span>
                                            {unreadCount > 0 && (
                                                <button onClick={markAllRead} className="text-[10px] font-medium" style={{ color: 'var(--accent-text)' }}>
                                                    Mark all read
                                                </button>
                                            )}
                                        </div>
                                        <div className="overflow-y-auto max-h-60">
                                            {myNotifs.length === 0 ? (
                                                <p className="text-xs text-center py-6" style={{ color: 'var(--text-muted)' }}>No notifications</p>
                                            ) : (
                                                myNotifs.map((n) => (
                                                    <div
                                                        key={n.id}
                                                        onClick={() => markRead(n.id)}
                                                        className="flex items-start gap-2 px-3 py-2.5 cursor-pointer transition-colors"
                                                        style={{
                                                            background: n.read ? 'transparent' : 'var(--accent-light)',
                                                            borderBottom: '1px solid var(--border)',
                                                        }}
                                                    >
                                                        <div
                                                            className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                                                            style={{ background: n.read ? 'transparent' : 'var(--accent)' }}
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>{n.message}</p>
                                                            <p className="text-[9px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{getTimeSince(n.createdAt)}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Cart (waiter/owner only) */}
                    {(role === 'waiter' || role === 'owner') && (
                        <motion.button ref={cartRef} whileTap={{ scale: 0.9 }} onClick={onCartToggle}
                            className="relative p-2 rounded-lg transition-colors"
                            style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
                        >
                            <ShoppingBag className="w-4 h-4" weight="fill" />
                            {itemCount > 0 && (
                                <motion.span key={itemCount} initial={{ scale: 0.3 }} animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 min-w-[16px] h-[16px] text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 shadow-sm"
                                    style={{ background: 'var(--danger)', color: '#fff' }}
                                >
                                    {itemCount}
                                </motion.span>
                            )}
                        </motion.button>
                    )}

                    {/* Profile */}
                    <div className="flex items-center gap-3 py-1 pl-2 pr-2 cursor-pointer ml-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border" style={{ borderColor: 'var(--border)' }}>
                            <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--bg-elevated)' }}>
                                <User className="w-5 h-5" weight="fill" style={{ color: 'var(--text-secondary)' }} />
                            </div>
                        </div>
                        <div className="hidden md:flex flex-col">
                            <span className="text-sm font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>{userName || 'David Spade'}</span>
                            <span className="text-[11px] font-medium leading-tight mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                {role === 'owner' ? 'Sales Admin' : role ? role : 'Sales Admin'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
