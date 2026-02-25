'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MagnifyingGlass,
    List,
    GridFour,
    Plus,
    Minus,
    Trash,
    Receipt,
    ArrowsSplit,
    Printer,
    CheckCircle,
    CaretDown,
    User,
    Storefront,
    Motorcycle,
    Armchair,
} from '@phosphor-icons/react';

// === MOCK DATA ===
const categories = ['All', 'Starters', 'Mains', 'Desserts', 'Beverages'];
const menuItems = [
    { id: 1, name: 'Truffle Fries', price: 450, category: 'Starters', image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400&q=80', stock: 24, type: 'food' },
    { id: 2, name: 'Margherita Pizza', price: 850, category: 'Mains', image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&q=80', stock: 15, type: 'food' },
    { id: 3, name: 'Wagyu Burger', price: 1250, category: 'Mains', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', stock: 8, type: 'food' },
    { id: 4, name: 'Caesar Salad', price: 650, category: 'Starters', image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&q=80', stock: 12, type: 'food' },
    { id: 5, name: 'Iced Latte', price: 350, category: 'Beverages', image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&q=80', stock: 50, type: 'beverage' },
    { id: 6, name: 'Craft IPA', price: 600, category: 'Beverages', image: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?w=400&q=80', stock: 35, type: 'beverage' },
    { id: 7, name: 'Tiramisu', price: 550, category: 'Desserts', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea6c7e9?w=400&q=80', stock: 10, type: 'food' },
    { id: 8, name: 'Mojito', price: 500, category: 'Beverages', image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&q=80', stock: 40, type: 'beverage' },
];

type OrderType = 'Dine-In' | 'Takeaway' | 'Delivery';
type CartItem = { id: number; name: string; price: number; quantity: number; type: string };

export default function POSPage() {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [orderType, setOrderType] = useState<OrderType>('Dine-In');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedTable] = useState<string>('Select Table');
    const [isMenuList, setIsMenuList] = useState(false); // Grid vs List view


    const filteredItems = menuItems.filter(item =>
        (activeCategory === 'All' || item.category === activeCategory) &&
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const addToCart = (item: typeof menuItems[0]) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1, type: item.type }];
        });
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQ = item.quantity + delta;
                return newQ > 0 ? { ...item, quantity: newQ } : item;
            }
            return item;
        }));
    };

    const removeItem = (id: number) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.13; // 13% VAT
    const discount = 0; // Hook up dynamic pricing here if happy hour
    const total = subtotal + tax - discount;

    const itemsForKOT = cart.filter(i => i.type === 'food').length;
    const itemsForBOT = cart.filter(i => i.type === 'beverage').length;

    return (
        <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-100px)] overflow-auto lg:overflow-hidden rounded-3xl" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}>

            {/* TOP/LEFT: Menu Selection */}
            <div className="flex-1 flex flex-col min-w-0 lg:overflow-hidden w-full" style={{ borderRight: 'none' }}>
                {/* Header / Search */}
                <div className="p-5 w-full min-w-0 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-4 justify-between w-full min-w-0">
                        <div className="relative flex-1 max-w-md">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search menu items..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium outline-none transition-shadow focus:ring-2 focus:ring-black dark:focus:ring-white"
                                style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsMenuList(false)} className={`p-2.5 rounded-lg transition-colors ${!isMenuList ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}>
                                <GridFour className="w-5 h-5" weight={!isMenuList ? 'fill' : 'regular'} />
                            </button>
                            <button onClick={() => setIsMenuList(true)} className={`p-2.5 rounded-lg transition-colors ${isMenuList ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}>
                                <List className="w-5 h-5" weight={isMenuList ? 'bold' : 'regular'} />
                            </button>
                        </div>
                    </div>

                    {/* Categories Scroll */}
                    <div className="flex items-center gap-2 mt-5 overflow-x-auto hide-scrollbar pb-1 w-full min-w-0">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className="px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all"
                                style={{
                                    background: activeCategory === cat ? 'var(--accent)' : 'transparent',
                                    color: activeCategory === cat ? 'var(--accent-fg)' : 'var(--text-secondary)',
                                    border: `1px solid ${activeCategory === cat ? 'transparent' : 'var(--border)'}`
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid/List */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 hide-scrollbar relative w-full min-w-0">
                    {filteredItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                                <span className="text-2xl opacity-50">🍽️</span>
                            </div>
                            <p className="text-gray-500 font-medium font-sm">No items found.</p>
                        </div>
                    ) : (
                        <div className={`grid gap-4 sm:gap-5 ${isMenuList ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'}`}>
                            {filteredItems.map(item => (
                                <motion.div
                                    layoutId={`item-${item.id}`}
                                    key={item.id}
                                    onClick={() => addToCart(item)}
                                    className={`group cursor-pointer rounded-2xl p-3 flex transition-all hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] ${isMenuList ? 'flex-row items-center gap-4' : 'flex-col justify-between'}`}
                                    style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
                                >
                                    <div className={`${isMenuList ? 'w-24 h-24 shrink-0' : 'w-full h-32'} rounded-xl bg-gray-200 overflow-hidden relative ${!isMenuList ? 'mb-3' : ''}`}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded border border-white/20">
                                            <span className="text-[10px] font-bold text-black dark:text-white">Stock: {item.stock}</span>
                                        </div>
                                    </div>
                                    <div className={`px-1 flex flex-col ${isMenuList ? 'flex-1 min-w-0 justify-center' : ''}`}>
                                        <h3 className="text-sm font-bold truncate leading-tight mb-1" style={{ color: 'var(--text-primary)' }}>{item.name}</h3>
                                        <div className={`flex items-center justify-between mt-2 ${isMenuList ? 'pr-2' : ''}`}>
                                            <span className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>NPR {item.price}</span>
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm shrink-0" style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
                                                <Plus className="w-4 h-4" weight="bold" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {/* BOTTOM/RIGHT: Active Order Panel */}
            <div className="w-full lg:max-w-[400px] flex flex-col shrink-0 bg-gray-50 dark:bg-[#000000] lg:border-l lg:border-(--border)" style={{ borderTop: '1px solid var(--border)' }}>

                {/* Order Type Tabs */}
                <div className="p-5 pb-0 w-full min-w-0 shrink-0">
                    <div className="flex items-center justify-between p-1 rounded-xl mb-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                        {[
                            { id: 'Dine-In', icon: Armchair },
                            { id: 'Takeaway', icon: Storefront },
                            { id: 'Delivery', icon: Motorcycle }
                        ].map(type => (
                            <button
                                key={type.id}
                                onClick={() => setOrderType(type.id as OrderType)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all relative"
                                style={{
                                    color: orderType === type.id ? 'var(--accent-fg)' : 'var(--text-muted)',
                                }}
                            >
                                {orderType === type.id && (
                                    <motion.div layoutId="orderTypeBg" className="absolute inset-0 rounded-lg shadow-sm" style={{ background: 'var(--accent)' }} />
                                )}
                                <type.icon className="w-4 h-4 relative z-10" weight={orderType === type.id ? "fill" : "regular"} />
                                <span className="relative z-10">{type.id}</span>
                            </button>
                        ))}
                    </div>

                    {/* Meta Selectors */}
                    <div className="flex items-center gap-3">
                        <button className="flex-1 flex items-center justify-between p-3 rounded-xl border border-dashed transition-colors hover:border-black dark:hover:border-white" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Walk-in Client</span>
                            </div>
                            <CaretDown className="w-3 h-3 text-gray-400" strokeWidth={3} />
                        </button>

                        {orderType === 'Dine-In' && (
                            <button className="flex-1 flex items-center justify-between p-3 rounded-xl border transition-colors hover:border-black dark:hover:border-white shadow-sm" style={{ borderColor: 'var(--border)', background: 'var(--accent)', color: 'var(--accent-fg)' }}>
                                <span className="text-xs font-bold">{selectedTable}</span>
                                <CaretDown className="w-3 h-3 opacity-60" strokeWidth={3} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 relative hide-scrollbar w-full min-w-0">
                    {cart.length === 0 ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 opacity-60">
                            <Receipt className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-700" weight="thin" />
                            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Cart is empty. Add items to start a new order.</p>
                        </div>
                    ) : (
                        <AnimatePresence initial={false}>
                            {cart.map(item => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20, scale: 0.95 }}
                                    className="flex items-center justify-between group"
                                >
                                    <div className="flex-1 pr-3">
                                        <h4 className="text-sm font-bold leading-tight mb-1" style={{ color: 'var(--text-primary)' }}>{item.name}</h4>
                                        <p className="text-[11px] font-bold" style={{ color: 'var(--text-muted)' }}>NPR {item.price}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 rounded-sm flex items-center justify-center transition-colors bg-white border dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-500 hover:text-black dark:hover:text-white">
                                            <Minus className="w-3 h-3 w-bold" />
                                        </button>
                                        <span className="w-5 text-center text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 rounded-sm flex items-center justify-center transition-colors bg-white border dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-500 hover:text-black dark:hover:text-white">
                                            <Plus className="w-3 h-3 w-bold" />
                                        </button>
                                        <button onClick={() => removeItem(item.id)} className="w-7 h-7 rounded-md flex items-center justify-center ml-1 text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {/* Footer / Checkout Box */}
                <div className="p-5 pt-6 bg-white dark:bg-[#09090B]" style={{ borderTop: '1px solid var(--border)' }}>

                    {/* Routing Indicators (KOT/BOT) */}
                    {cart.length > 0 && (
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-dashed border-gray-200 dark:border-zinc-800">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Routing</span>
                            <div className="flex gap-2 text-[10px] font-bold">
                                {itemsForKOT > 0 && <span className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded-md text-black dark:text-white">KOT ({itemsForKOT})</span>}
                                {itemsForBOT > 0 && <span className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded-md text-black dark:text-white">BOT ({itemsForBOT})</span>}
                            </div>
                        </div>
                    )}

                    <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                            <span>Subtotal</span>
                            <span>NPR {subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                            <span>VAT (13%)</span>
                            <span>NPR {tax.toLocaleString()}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-xs font-semibold text-green-500">
                                <span>Discount</span>
                                <span>- NPR {discount.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-end pt-2 mt-2" style={{ borderTop: '1px solid var(--border)' }}>
                            <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Total</span>
                            <span className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>NPR {total.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex gap-1.5 sm:gap-2">
                        <button className="flex-1 min-w-0 flex flex-col items-center justify-center gap-1 py-2 sm:py-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                            <ArrowsSplit className="w-5 h-5 shrink-0" />
                            <span className="text-[9px] sm:text-[10px] font-bold truncate px-1 max-w-full">Split</span>
                        </button>
                        <button className="flex-1 min-w-0 flex flex-col items-center justify-center gap-1 py-2 sm:py-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                            <Printer className="w-5 h-5 shrink-0" />
                            <span className="text-[9px] sm:text-[10px] font-bold truncate px-1 max-w-full">Print KOT</span>
                        </button>
                        <button className="flex-[1.5] sm:flex-2 min-w-0 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 rounded-xl shadow-lg transition-transform active:scale-[0.98]" style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
                            <span className="text-xs sm:text-sm font-bold truncate px-1 max-w-full">Charge</span>
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" weight="bold" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
