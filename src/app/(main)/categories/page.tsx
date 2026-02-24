'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ForkKnife as Utensils, ArrowRight as ArrowRight, ChefHat as ChefHat } from '@phosphor-icons/react';
import { categories, menuItems } from '@/data/menuData';
import { useRouter } from 'next/navigation';

export default function CategoriesPage() {
    const router = useRouter();

    const categoryData = useMemo(() => {
        return categories
            .filter((c) => c.id !== 'all')
            .map((cat) => {
                const items = menuItems.filter((item) => {
                    const normCat = item.category.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
                    return normCat === cat.id || item.category.toLowerCase().includes(cat.id) || cat.id.includes(item.category.toLowerCase().replace(/\s+/g, '-'));
                });
                const available = items.filter((i) => i.is_available).length;
                const avgPrice = items.length > 0 ? Math.round(items.reduce((s, i) => s + i.price, 0) / items.length) : 0;
                return { ...cat, items, total: items.length, available, avgPrice };
            });
    }, []);

    const anim = (i: number) => ({
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: i * 0.05, type: 'spring' as const, stiffness: 300, damping: 25 },
    });

    return (
        <div className="space-y-5 page-enter">
            <div>
                <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Categories</h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {categoryData.length} categories · {menuItems.length} total dishes
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {categoryData.map((cat, i) => (
                    <motion.div key={cat.id} {...anim(i)}
                        onClick={() => router.push(`/menu?category=${cat.id}`)}
                        className="group flex flex-col rounded-3xl p-6 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

                        {/* Icon */}
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border shadow-sm shrink-0"
                            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
                            <Utensils className="w-6 h-6" weight="fill" style={{ color: 'var(--text-primary)' }} />
                        </div>

                        {/* Info */}
                        <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{cat.label}</h3>
                        <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
                            {cat.total} dish{cat.total !== 1 ? 'es' : ''}
                        </p>

                        {/* Preview items */}
                        <div className="flex -space-x-2 mb-5">
                            {cat.items.slice(0, 4).map((item) => (
                                <div key={item.id} className="w-10 h-10 rounded-xl overflow-hidden border-2 shrink-0 shadow-sm"
                                    style={{ borderColor: 'var(--bg-card)', background: 'var(--bg-elevated)' }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                            {cat.items.length > 4 && (
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-bold border-2 shrink-0 shadow-sm"
                                    style={{ borderColor: 'var(--bg-card)', background: 'var(--bg-input)', color: 'var(--text-muted)' }}>
                                    +{cat.items.length - 4}
                                </div>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between mt-auto pt-2">
                            <div className="flex gap-2 items-center">
                                <span className="text-[10px] px-2 py-1 rounded-md border font-bold uppercase tracking-wider"
                                    style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                                    {cat.available} available
                                </span>
                                <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
                                    ~Rs. {cat.avgPrice}
                                </span>
                            </div>
                            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" weight="bold"
                                style={{ color: 'var(--text-primary)' }} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {categoryData.length === 0 && (
                <div className="text-center py-16">
                    <ChefHat className="w-10 h-10 mx-auto mb-2" weight="fill" style={{ color: 'var(--text-muted)' }} />
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No categories yet</p>
                </div>
            )}
        </div>
    );
}
