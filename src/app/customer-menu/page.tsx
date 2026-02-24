'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    MagnifyingGlass as Search,
    ChefHat as ChefHat,
    Fire as Flame
} from '@phosphor-icons/react';
import { categories, menuItems } from '@/data/menuData';
import { LogoIcon } from '@/components/Logo';

export default function CustomerMenuPage() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [search, setSearch] = useState('');

    const filteredItems = useMemo(() => {
        let items = menuItems.filter((i) => i.is_available);
        if (activeCategory !== 'all') {
            items = items.filter((item) => {
                const normCat = item.category.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
                return normCat === activeCategory || item.category.toLowerCase().includes(activeCategory);
            });
        }
        if (search) {
            items = items.filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.description.toLowerCase().includes(search.toLowerCase())
            );
        }
        return items;
    }, [activeCategory, search]);

    const groupedItems = useMemo(() => {
        const groups: Record<string, typeof menuItems> = {};
        filteredItems.forEach((item) => {
            const cat = item.category;
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(item);
        });
        return groups;
    }, [filteredItems]);

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
            {/* Header */}
            <div className="sticky top-0 z-10 px-4 py-3" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(12px)' }}>
                <div className="max-w-lg mx-auto">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: 'var(--accent)' }}>
                            <LogoIcon size={16} style={{ color: 'var(--accent-fg)' }} />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>
                                myRestro
                            </h1>
                            <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>Menu</p>
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" weight="bold" style={{ color: 'var(--text-muted)' }} />
                        <input type="text" placeholder="Search dishes..." value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg pl-8 pr-3 py-2 text-[12px] focus:outline-none focus:ring-1"
                            style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                </div>
            </div>

            {/* Category Pills */}
            <div className="px-4 py-2.5 overflow-x-auto hide-scrollbar">
                <div className="max-w-lg mx-auto flex gap-1.5">
                    {categories.map((cat) => {
                        const isActive = activeCategory === cat.id;
                        return (
                            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                                className="px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all"
                                style={{
                                    background: isActive ? 'var(--accent)' : 'var(--bg-input)',
                                    color: isActive ? 'var(--accent-fg)' : 'var(--text-secondary)',
                                    border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                                }}>{cat.label}</button>
                        );
                    })}
                </div>
            </div>

            {/* Menu Items */}
            <div className="px-4 pb-8">
                <div className="max-w-lg mx-auto space-y-6">
                    {Object.entries(groupedItems).map(([category, items]) => (
                        <div key={category}>
                            <h2 className="text-xs font-bold uppercase tracking-wider mb-2.5 px-1"
                                style={{ color: 'var(--text-muted)' }}>{category}</h2>
                            <div className="space-y-2">
                                {items.map((item) => (
                                    <motion.div key={item.id}
                                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                        className="flex gap-3 p-3 rounded-xl"
                                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0"
                                            style={{ background: 'var(--bg-elevated)' }}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-1">
                                                <h3 className="text-[12px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                                                    {item.name}
                                                    {item.spice_levels && item.spice_levels.length > 2 && (
                                                        <span className="absolute top-2 left-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold"
                                                            style={{ background: 'rgba(0,0,0,0.6)', color: '#fff' }}>
                                                            <Flame className="w-3 h-3 shrink-0 mt-0.5" weight="fill" style={{ color: 'var(--danger)' }} /> Spicy
                                                        </span>
                                                    )}
                                                </h3>
                                            </div>
                                            <p className="text-[10px] leading-relaxed line-clamp-2 mt-0.5"
                                                style={{ color: 'var(--text-muted)' }}>{item.description}</p>
                                            <div className="flex items-center justify-between mt-1.5">
                                                <span className="text-[12px] font-bold" style={{ color: 'var(--text-primary)' }}>
                                                    Rs. {item.price}
                                                </span>
                                                {item.sizes && (
                                                    <div className="flex gap-1">
                                                        {item.sizes.map((s) => (
                                                            <span key={s} className="text-[8px] px-1.5 py-0.5 rounded"
                                                                style={{ background: 'var(--bg-input)', color: 'var(--text-muted)' }}>{s}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {filteredItems.length === 0 && (
                        <div className="text-center py-12">
                            <ChefHat className="w-8 h-8 mx-auto mb-2" weight="fill" style={{ color: 'var(--text-muted)' }} />
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No dishes found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="text-center py-4 text-[9px]" style={{ color: 'var(--text-muted)' }}>
                Powered by myRestro Manager
            </div>
        </div>
    );
}
