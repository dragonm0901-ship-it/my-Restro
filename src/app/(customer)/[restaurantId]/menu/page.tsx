'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MagnifyingGlass,
    Leaf,
    Fire as Flame,
    CubeFocus,
    Sparkle,
    Timer,
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { MenuItem } from '@/types';
import ItemDetailSheet from '@/components/menu/ItemDetailSheet';
import CustomerCart, { CustomerCartItem } from '@/components/menu/CustomerCart';
import { LogoIcon } from '@/components/Logo';

// Dynamic import for AR viewer (needs window/DOM)
const ARViewer = dynamic(() => import('@/components/menu/ARViewer').then(mod => mod.ARViewer), { ssr: false });

// Fallback: import static menu data for demo mode
import { menuItems as staticMenuItems, categories as staticCategories } from '@/data/menuData';

export default function CustomerMenuPage({
    params,
    searchParams,
}: {
    params: Promise<{ restaurantId: string }>;
    searchParams: Promise<{ table?: string }>;
}) {
    const unwrappedParams = React.use(params);
    const unwrappedSearch = React.use(searchParams);
    const restaurantId = unwrappedParams.restaurantId;
    const tableNumber = unwrappedSearch.table || 'Walk-in';

    const [restaurantName, setRestaurantName] = useState('Restaurant');
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<{ id: string; label: string }[]>([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Interactive states
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [arItem, setArItem] = useState<MenuItem | null>(null);
    const [cart, setCart] = useState<CustomerCartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const supabase = useMemo(() => createClient(), []);

    // Load data from Supabase or fallback to static
    useEffect(() => {
        async function loadData() {
            setIsLoading(true);

            // Check if it's a demo restaurant
            const isDemoRestaurant = restaurantId === 'demo-restro-id';

            if (isDemoRestaurant) {
                // Use static menu data for demo
                setRestaurantName('myRestro Demo');
                setMenuItems(staticMenuItems);
                setCategories(staticCategories);
                setIsLoading(false);
                return;
            }

            try {
                // 1. Fetch Restaurant details
                const { data: restaurant } = await supabase
                    .from('restaurants')
                    .select('name')
                    .eq('id', restaurantId)
                    .single();

                if (restaurant) setRestaurantName(restaurant.name);

                // 2. Fetch Categories
                const { data: cats } = await supabase
                    .from('categories')
                    .select('id, name, sort_order')
                    .eq('restaurant_id', restaurantId)
                    .order('sort_order');

                if (cats && cats.length > 0) {
                    setCategories([
                        { id: 'all', label: 'All' },
                        ...cats.map(c => ({ id: c.id, label: c.name })),
                    ]);
                }

                // 3. Fetch Menu Items
                const { data: items } = await supabase
                    .from('menu_items')
                    .select('*')
                    .eq('restaurant_id', restaurantId)
                    .eq('is_available', true);

                if (items && items.length > 0) {
                    setMenuItems(items as MenuItem[]);
                } else {
                    // Fallback to static data if no Supabase items
                    setMenuItems(staticMenuItems);
                    setCategories(staticCategories);
                }
            } catch (err) {
                console.error('Failed to load menu:', err);
                // Fallback to static
                setMenuItems(staticMenuItems);
                setCategories(staticCategories);
                setRestaurantName('myRestro Demo');
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [restaurantId]);

    // Filtered items
    const filteredItems = useMemo(() => {
        let items = menuItems.filter((i) => i.is_available);
        if (activeCategory !== 'all') {
            items = items.filter((item) => {
                const normCat = item.category.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
                return normCat === activeCategory || item.category.toLowerCase().includes(activeCategory);
            });
        }
        if (search) {
            const q = search.toLowerCase();
            items = items.filter((item) =>
                item.name.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q)
            );
        }
        return items;
    }, [menuItems, activeCategory, search]);

    // Group items by category
    const groupedItems = useMemo(() => {
        const groups: Record<string, MenuItem[]> = {};
        filteredItems.forEach((item) => {
            const cat = item.category;
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(item);
        });
        return groups;
    }, [filteredItems]);

    // Featured item (first AR-enabled item or first item)
    const featuredItem = useMemo(() =>
        menuItems.find(i => i.ar_model_url && i.is_available) || menuItems[0],
    [menuItems]);

    // Cart functions
    const addToCart = useCallback((item: MenuItem, quantity: number, options: { size?: string; variation?: string; spice?: string }) => {
        setCart(prev => {
            const existingIdx = prev.findIndex(ci =>
                ci.item.id === item.id &&
                ci.selectedSize === options.size &&
                ci.selectedVariation === options.variation
            );
            if (existingIdx > -1) {
                const updated = [...prev];
                updated[existingIdx] = { ...updated[existingIdx], quantity: updated[existingIdx].quantity + quantity };
                return updated;
            }
            return [...prev, {
                item,
                quantity,
                selectedSize: options.size,
                selectedVariation: options.variation,
                selectedSpice: options.spice,
            }];
        });
        toast.success(`${quantity}× ${item.name} added`, { icon: '🛒', duration: 1500 });
    }, []);

    const updateCartQuantity = useCallback((itemId: string, delta: number) => {
        setCart(prev => prev.map(ci =>
            ci.item.id === itemId ? { ...ci, quantity: Math.max(0, ci.quantity + delta) } : ci
        ).filter(ci => ci.quantity > 0));
    }, []);

    const removeFromCart = useCallback((itemId: string) => {
        setCart(prev => prev.filter(ci => ci.item.id !== itemId));
    }, []);

    const placeOrder = useCallback(async (notes: string) => {
        if (cart.length === 0) return;

        const isDemoRestaurant = restaurantId === 'demo-restro-id';

        if (isDemoRestaurant) {
            // Simulate order for demo
            await new Promise(r => setTimeout(r, 1500));
            toast.success('Demo order placed! 🎉');
            setCart([]);
            return;
        }

        const subtotal = cart.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
        const tax = subtotal * 0.13;
        const total = subtotal + tax;

        // Create order in Supabase
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                restaurant_id: restaurantId,
                type: 'Dine-In',
                status: 'pending',
                table_number: tableNumber,
                subtotal,
                tax,
                discount: 0,
                total,
                notes: notes || null,
            })
            .select()
            .single();

        if (orderError) {
            toast.error('Failed to place order. Please call a waiter.');
            throw orderError;
        }

        // Insert order items
        const orderItems = cart.map(ci => ({
            order_id: order.id,
            menu_item_id: ci.item.id,
            quantity: ci.quantity,
            price_at_time: ci.item.price,
            notes: [ci.selectedSize, ci.selectedVariation, ci.selectedSpice].filter(Boolean).join(', ') || null,
        }));

        const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

        if (itemsError) {
            toast.error('Failed to add items. Please call a waiter.');
            throw itemsError;
        }

        toast.success('Order sent to kitchen! 🧑‍🍳');
        setCart([]);
    }, [cart, restaurantId, tableNumber, supabase]);

    return (
        <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
            {/* Sticky Header */}
            <div
                className="sticky top-0 z-30 px-4 pt-3 pb-3"
                style={{
                    background: 'rgba(10, 10, 15, 0.85)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
            >
                <div className="max-w-lg mx-auto">
                    {/* Restaurant Info */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-black" style={{ background: '#fff' }}>
                                <LogoIcon size={18} />
                            </div>
                            <div>
                                <h1 className="text-sm font-bold font-['Outfit'] text-white leading-tight">
                                    {restaurantName}
                                </h1>
                                <p className="text-[9px] text-white/30">Digital Menu</p>
                            </div>
                        </div>
                        <div className="px-3 py-1 rounded-full text-[10px] font-bold" style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}>
                            Table {tableNumber}
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" weight="bold" />
                        <input
                            type="text"
                            placeholder="Search dishes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-white/20"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                        />
                    </div>
                </div>
            </div>

            {/* Category Pills */}
            <div className="px-4 py-3 overflow-x-auto hide-scrollbar">
                <div className="max-w-lg mx-auto flex gap-2">
                    {categories.map((cat) => {
                        const isActive = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className="px-4 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all active:scale-95"
                                style={{
                                    background: isActive ? '#fff' : 'rgba(255,255,255,0.05)',
                                    color: isActive ? '#000' : 'rgba(255,255,255,0.5)',
                                    border: `1px solid ${isActive ? '#fff' : 'rgba(255,255,255,0.08)'}`,
                                }}
                            >
                                {cat.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="max-w-lg mx-auto px-4 space-y-4 py-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex gap-3 p-3 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <div className="w-20 h-20 rounded-lg bg-white/5" />
                            <div className="flex-1 space-y-2 py-1">
                                <div className="h-3 w-2/3 rounded bg-white/5" />
                                <div className="h-2 w-full rounded bg-white/5" />
                                <div className="h-3 w-1/4 rounded bg-white/5" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Featured Hero */}
            {!isLoading && featuredItem && activeCategory === 'all' && !search && (
                <div className="px-4 pb-4">
                    <div className="max-w-lg mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative overflow-hidden rounded-2xl cursor-pointer group"
                            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                            onClick={() => setSelectedItem(featuredItem)}
                        >
                            <div className="relative h-52 overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={featuredItem.image_url}
                                    alt={featuredItem.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

                                {/* Featured badge */}
                                <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-400 backdrop-blur-md border border-amber-500/20">
                                    <Sparkle className="w-3 h-3" weight="fill" /> Chef&apos;s Special
                                </div>

                                {/* AR badge */}
                                {featuredItem.ar_model_url && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setArItem(featuredItem); }}
                                        className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold bg-white/15 text-white backdrop-blur-md border border-white/10 active:scale-95 transition-transform"
                                    >
                                        <CubeFocus className="w-3.5 h-3.5" weight="fill" /> View in AR
                                    </button>
                                )}

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                                    <h2 className="text-xl font-black text-white tracking-tight font-['Outfit']">
                                        {featuredItem.name}
                                    </h2>
                                    <p className="text-white/50 text-[11px] mt-1 leading-relaxed line-clamp-2">
                                        {featuredItem.description}
                                    </p>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="text-white font-black text-lg font-mono">Rs. {featuredItem.price}</span>
                                        <div className="flex items-center gap-3 text-white/40 text-[10px]">
                                            {featuredItem.calories && (
                                                <span>{featuredItem.calories} kcal</span>
                                            )}
                                            {featuredItem.prep_time_minutes !== undefined && (
                                                <span className="flex items-center gap-0.5">
                                                    <Timer className="w-3 h-3" weight="fill" />
                                                    {featuredItem.prep_time_minutes} min
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            {/* Menu Items */}
            {!isLoading && (
                <div className="px-4 pb-32">
                    <div className="max-w-lg mx-auto space-y-6">
                        {Object.entries(groupedItems).map(([category, items]) => (
                            <div key={category}>
                                <h2 className="text-[11px] font-bold uppercase tracking-widest mb-3 px-1 text-white/30">
                                    {category}
                                </h2>
                                <div className="space-y-2">
                                    {items.map((item, i) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.03, duration: 0.3 }}
                                            className="flex gap-3 p-3 rounded-xl cursor-pointer group active:scale-[0.98] transition-transform"
                                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                                            onClick={() => setSelectedItem(item)}
                                        >
                                            {/* Image */}
                                            <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    loading="lazy"
                                                />
                                                {/* Veg badge */}
                                                {item.is_vegetarian && (
                                                    <span className="absolute top-1 left-1 w-4 h-4 rounded-sm flex items-center justify-center bg-emerald-500/90">
                                                        <Leaf className="w-2.5 h-2.5 text-white" weight="fill" />
                                                    </span>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0 py-0.5">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className="text-sm font-bold text-white leading-tight truncate">
                                                        {item.name}
                                                    </h3>
                                                    {item.spice_levels && item.spice_levels.length > 2 && (
                                                        <Flame className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" weight="fill" />
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-white/35 leading-relaxed mt-0.5 line-clamp-2">
                                                    {item.description}
                                                </p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-sm font-black text-white font-mono">
                                                        Rs. {item.price}
                                                    </span>
                                                    <div className="flex items-center gap-1.5">
                                                        {item.ar_model_url && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setArItem(item); }}
                                                                className="flex items-center gap-0.5 text-[8px] px-2 py-1 rounded-full font-bold bg-white/10 text-white/60 border border-white/10 active:scale-95 transition-transform"
                                                            >
                                                                <CubeFocus className="w-3 h-3" weight="fill" /> AR
                                                            </button>
                                                        )}
                                                        {item.sizes && item.sizes.length > 0 && (
                                                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-white/30 border border-white/5">
                                                                {item.sizes[0]}
                                                            </span>
                                                        )}
                                                        {item.prep_time_minutes !== undefined && (
                                                            <span className="text-[8px] text-white/25 flex items-center gap-0.5">
                                                                <Timer className="w-2.5 h-2.5" weight="fill" />{item.prep_time_minutes}m
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {filteredItems.length === 0 && !isLoading && (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                                    <MagnifyingGlass className="w-6 h-6 text-white/20" weight="bold" />
                                </div>
                                <p className="text-white/30 text-sm font-medium">No dishes found</p>
                                <p className="text-white/15 text-xs mt-1">Try a different search or category</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="text-center py-4 text-[9px] text-white/15 font-medium">
                Powered by myRestro Manager
            </div>

            {/* Item Detail Sheet */}
            <ItemDetailSheet
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
                onAddToCart={addToCart}
                onViewAR={(item) => { setSelectedItem(null); setTimeout(() => setArItem(item), 300); }}
            />

            {/* Customer Cart */}
            <CustomerCart
                items={cart}
                isOpen={isCartOpen}
                onOpen={() => setIsCartOpen(true)}
                onClose={() => setIsCartOpen(false)}
                onUpdateQuantity={updateCartQuantity}
                onRemoveItem={removeFromCart}
                onPlaceOrder={placeOrder}
                tableNumber={tableNumber}
                restaurantName={restaurantName}
            />

            {/* AR Viewer */}
            <AnimatePresence>
                {arItem && arItem.ar_model_url && (
                    <ARViewer
                        isOpen={!!arItem}
                        onClose={() => setArItem(null)}
                        modelSrc={arItem.ar_model_url}
                        iosSrc={arItem.ar_model_ios}
                        itemName={arItem.name}
                        itemPrice={arItem.price}
                        itemDescription={arItem.description}
                        calories={arItem.calories}
                        prepTime={arItem.prep_time_minutes}
                        spiceLevels={arItem.spice_levels}
                        allergens={arItem.allergens}
                        isVegetarian={arItem.is_vegetarian}
                        onAddToCart={() => {
                            addToCart(arItem, 1, {
                                size: arItem.sizes?.[0],
                                variation: arItem.variations?.[0],
                            });
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
