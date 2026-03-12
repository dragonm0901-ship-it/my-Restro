'use client';

import { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MagnifyingGlass as Search, Plus as Plus, GridFour as Grid3X3, List as List,
    EyeClosed as EyeOff, Fire as Flame, QrCode as QrCode,
    DownloadSimple as Download, X as X
} from '@phosphor-icons/react';
import { useSearchParams } from 'next/navigation';
import QRCodeLib from 'qrcode';
import { categories, menuItems } from '@/data/menuData';
import { useCartStore } from '@/stores/useCartStore';
import { useRoleStore } from '@/stores/useRoleStore';
import toast from 'react-hot-toast';

export default function MenuPage() {
    return (
        <Suspense fallback={<div className="space-y-4 page-enter"><div className="h-6 w-32 animate-pulse rounded-lg" style={{ background: 'var(--bg-input)' }} /></div>}>
            <MenuPageInner />
        </Suspense>
    );
}

function MenuPageInner() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category');
    const [activeCategory, setActiveCategory] = useState(categoryParam || 'all');
    const [search, setSearch] = useState('');
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [showQR, setShowQR] = useState(false);
    const [qrDataUrl, setQrDataUrl] = useState('');
    const { addItem, items: cartItems } = useCartStore();
    const { role } = useRoleStore();

    useEffect(() => {
        if (categoryParam) {
            setTimeout(() => setActiveCategory(categoryParam), 0);
        }
    }, [categoryParam]);

    const generateQR = useCallback(() => {
        const url = typeof window !== 'undefined' ? `${window.location.origin}/customer-menu` : '';
        if (url) {
            QRCodeLib.toDataURL(url, { width: 400, margin: 2, color: { dark: '#000000', light: '#ffffff' }, errorCorrectionLevel: 'H' })
                .then(setQrDataUrl);
        }
        setShowQR(true);
    }, []);

    const downloadQR = useCallback(() => {
        if (!qrDataUrl) return;
        const link = document.createElement('a');
        link.download = 'myrestromanager-Menu-QR.png';
        link.href = qrDataUrl;
        link.click();
    }, [qrDataUrl]);

    const filteredItems = useMemo(() => {
        let items = menuItems;
        if (activeCategory !== 'all') {
            const cat = categories.find((c) => c.id === activeCategory);
            if (cat) {
                items = items.filter((item) => {
                    const normCat = item.category.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
                    const normId = activeCategory.toLowerCase();
                    return normCat === normId ||
                        item.category.toLowerCase().includes(normId) ||
                        normId.includes(item.category.toLowerCase().replace(/\s+/g, '-'));
                });
            }
        }
        if (search) {
            items = items.filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.description.toLowerCase().includes(search.toLowerCase())
            );
        }
        return items;
    }, [activeCategory, search]);

    const handleAddToCart = (item: typeof menuItems[0]) => {
        addItem(item);
        toast.success(`${item.name} added`, { duration: 1500 });
    };

    const cartCount = (id: string) => cartItems.find((i) => i.menu_item.id === id)?.quantity || 0;

    return (
        <div className="space-y-6 page-enter pb-8">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Menu</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Manage your digital menu items and categories.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative flex-1 min-w-[150px] sm:flex-initial">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" weight="bold" style={{ color: 'var(--text-muted)' }} />
                        <input type="text" placeholder="Search menu..." value={search} onChange={(e) => setSearch(e.target.value)}
                            className="rounded-xl pl-9 pr-4 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 transition-shadow"
                            style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                    <div className="flex rounded-xl overflow-hidden shrink-0" style={{ border: '1px solid var(--border)' }}>
                        <button onClick={() => setView('grid')} className="p-2"
                            style={{ background: view === 'grid' ? 'var(--bg-card)' : 'transparent', color: view === 'grid' ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                            <Grid3X3 className="w-4 h-4" weight="fill" />
                        </button>
                        <button onClick={() => setView('list')} className="p-2"
                            style={{ background: view === 'list' ? 'var(--bg-card)' : 'transparent', color: view === 'list' ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                            <List className="w-4 h-4" weight="bold" />
                        </button>
                    </div>
                    {role === 'owner' && (
                        <button onClick={generateQR}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-transform active:scale-95"
                            style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
                            <QrCode className="w-4 h-4" weight="bold" /> Customer QR
                        </button>
                    )}
                </div>
            </div>

            {/* QR Modal */}
            <AnimatePresence>
                {showQR && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowQR(false)}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            className="rounded-2xl p-6 text-center max-w-sm w-full mx-4"
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                            onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Customer Menu QR</h3>
                                <button onClick={() => setShowQR(false)} className="p-1 rounded-lg" style={{ color: 'var(--text-muted)' }}>
                                    <X className="w-4 h-4" weight="bold" />
                                </button>
                            </div>
                            {qrDataUrl && (
                                <div className="bg-white rounded-xl p-4 mb-4 inline-block">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={qrDataUrl} alt="Menu QR" className="w-56 h-56" />
                                </div>
                            )}
                            <p className="text-[10px] mb-4" style={{ color: 'var(--text-muted)' }}>
                                Customers can scan this QR code to view your menu on their phones.
                                Download and print for tables or walls.
                            </p>
                            <button onClick={downloadQR}
                                className="flex items-center gap-1.5 mx-auto px-4 py-2 rounded-lg text-xs font-medium"
                                style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}>
                                <Download className="w-3.5 h-3.5" weight="bold" /> Download QR as PNG
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Category Tabs */}
            <div className="flex gap-1 overflow-x-auto hide-scrollbar pb-0.5">
                {categories.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    const count = cat.id === 'all' ? menuItems.length : menuItems.filter((item) => {
                        const normCat = item.category.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
                        return normCat === cat.id || item.category.toLowerCase().includes(cat.id) || cat.id.includes(item.category.toLowerCase().replace(/\s+/g, '-'));
                    }).length;
                    return (
                        <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                            className="px-3 py-[6px] rounded-lg text-[11px] font-medium whitespace-nowrap transition-all relative"
                            style={{
                                background: isActive ? 'var(--accent)' : 'var(--bg-input)',
                                color: isActive ? 'var(--accent-fg)' : 'var(--text-secondary)',
                                border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                            }}>
                            {cat.label}
                            <span className="ml-1 opacity-60">{count}</span>
                        </button>
                    );
                })}
            </div>

            {/* Items Counter */}
            <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
                {search && <span> matching &quot;{search}&quot;</span>}
            </p>

            {/* Grid View */}
            <AnimatePresence mode="wait">
                {view === 'grid' ? (
                    <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5">
                        {filteredItems.map((item, i) => {
                            const inCart = cartCount(item.id);
                            return (
                                <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.02, type: 'spring', stiffness: 300, damping: 25 }}
                                    className="group cursor-pointer rounded-3xl p-4 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
                                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
                                    {/* Image */}
                                    <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-4">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        {!item.is_available && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <span className="text-[10px] font-bold text-white/80">Sold Out</span>
                                            </div>
                                        )}
                                        {inCart > 0 && (
                                            <span className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white badge-pop"
                                                style={{ background: 'var(--accent)' }}>{inCart}</span>
                                        )}
                                        {item.spice_levels && (
                                            <span className="absolute top-2 left-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold"
                                                style={{ background: 'rgba(0,0,0,0.6)', color: '#fff' }}>
                                                <Flame className="w-2.5 h-2.5" weight="fill" style={{ color: 'var(--danger)' }} /> Spicy
                                            </span>
                                        )}
                                    </div>
                                    {/* Info */}
                                    <div className="px-1 flex flex-col flex-1">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div>
                                                <h3 className="text-base font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>{item.name}</h3>
                                                <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-auto pt-2">
                                            <span className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>Rs. {item.price}</span>
                                            {(role === 'owner' || role === 'waiter') && item.is_available && (
                                                <button onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-transform active:scale-95"
                                                    style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
                                                    <Plus className="w-3.5 h-3.5" weight="bold" /> Add
                                                </button>
                                            )}
                                        </div>
                                        {item.sizes && (
                                            <div className="flex gap-1 mt-1.5">
                                                {item.sizes.map((s) => (
                                                    <span key={s} className="text-[8px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-input)', color: 'var(--text-muted)' }}>{s}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    /* List View */
                    <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="rounded-3xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
                        {filteredItems.map((item, i) => {
                            const inCart = cartCount(item.id);
                            return (
                                <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                                    className="flex items-center gap-4 px-6 py-4 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors"
                                    style={{ borderBottom: i < filteredItems.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm border border-black/5 dark:border-white/5">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-base font-bold truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                                            {!item.is_available && (
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: 'color-mix(in srgb, var(--danger) 15%, transparent)', color: 'var(--danger)' }}>
                                                    <EyeOff className="w-3 h-3 inline mr-1" weight="bold" />Out
                                                </span>
                                            )}
                                            {inCart > 0 && (
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded badge-pop"
                                                    style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}>×{inCart}</span>
                                            )}
                                        </div>
                                        <p className="text-xs truncate font-medium" style={{ color: 'var(--text-muted)' }}>{item.category} · {item.description}</p>
                                    </div>
                                    <span className="text-sm font-black shrink-0" style={{ color: 'var(--text-primary)' }}>Rs. {item.price}</span>
                                    {(role === 'owner' || role === 'waiter') && item.is_available && (
                                        <button onClick={() => handleAddToCart(item)}
                                            className="ml-2 w-10 h-10 flex items-center justify-center rounded-xl shrink-0 transition-transform active:scale-95 shadow-sm" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                                            <Plus className="w-4 h-4" weight="bold" style={{ color: 'var(--text-primary)' }} />
                                        </button>
                                    )}
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
