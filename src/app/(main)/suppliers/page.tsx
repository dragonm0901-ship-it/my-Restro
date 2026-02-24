'use client';

import { motion } from 'framer-motion';
import { Truck as Truck, Phone as Phone, MapPin as MapPin, Star as Star, Plus as Plus, MagnifyingGlass as Search } from '@phosphor-icons/react';
import { useState } from 'react';

interface Supplier {
    id: string;
    name: string;
    category: string;
    phone: string;
    address: string;
    rating: number;
    lastOrder: string;
    totalSpent: number;
}

const suppliers: Supplier[] = [
    { id: 'SUP-001', name: 'Kalimati Tarkari Bazaar', category: 'Vegetables', phone: '9841000001', address: 'Kalimati, Kathmandu', rating: 4.5, lastOrder: '2026-02-18', totalSpent: 45000 },
    { id: 'SUP-002', name: 'Nepal Meat Supply', category: 'Meat', phone: '9841000002', address: 'Balkhu, Kathmandu', rating: 4.2, lastOrder: '2026-02-18', totalSpent: 120000 },
    { id: 'SUP-003', name: 'Bhatbhateni Store', category: 'Groceries', phone: '9841000003', address: 'Naxal, Kathmandu', rating: 4.0, lastOrder: '2026-02-15', totalSpent: 35000 },
    { id: 'SUP-004', name: 'Himalayan Spice Traders', category: 'Spices', phone: '9841000004', address: 'Asan, Kathmandu', rating: 4.8, lastOrder: '2026-02-16', totalSpent: 22000 },
    { id: 'SUP-005', name: 'Fresh Dairy Nepal', category: 'Dairy', phone: '9841000005', address: 'Baneshwor, Kathmandu', rating: 4.3, lastOrder: '2026-02-17', totalSpent: 18000 },
    { id: 'SUP-006', name: 'Tokha Oil Mill', category: 'Oil', phone: '9841000006', address: 'Tokha, Kathmandu', rating: 3.9, lastOrder: '2026-02-14', totalSpent: 28000 },
];

export default function SuppliersPage() {
    const [search, setSearch] = useState('');
    const filtered = suppliers.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Suppliers</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{suppliers.length} vendors managed digitally.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-transform active:scale-95"
                    style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
                    <Plus className="w-4 h-4" weight="bold" /> Add Supplier
                </button>
            </div>

            <div className="relative max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" weight="bold" style={{ color: 'var(--text-muted)' }} />
                <input type="text" placeholder="Search suppliers..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-1 transition-all"
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
                {filtered.map((sup, i) => (
                    <motion.div key={sup.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                        className="rounded-3xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm shrink-0"
                                    style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
                                    <Truck className="w-6 h-6" weight="fill" style={{ color: 'var(--text-primary)' }} />
                                </div>
                                <div>
                                    <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{sup.name}</p>
                                    <span className="text-[10px] font-bold px-2 py-1 rounded-md border uppercase tracking-wider mt-1 inline-block"
                                        style={{
                                            background: 'var(--bg-elevated)',
                                            borderColor: 'var(--border)',
                                            color: 'var(--text-primary)',
                                        }}>{sup.category}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-0.5">
                                <Star className="w-3 h-3" weight="fill" style={{ color: 'var(--warning)' }} />
                                <span className="text-[10px] font-semibold" style={{ color: 'var(--text-secondary)' }}>{sup.rating}</span>
                            </div>
                        </div>
                        <div className="space-y-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                            <div className="flex items-center gap-2"><Phone className="w-4 h-4" weight="fill" /> <span className="font-medium text-xs">{sup.phone}</span></div>
                            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" weight="fill" /> <span className="font-medium text-xs">{sup.address}</span></div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Rs. {(sup.totalSpent / 1000).toFixed(0)}k spent</span>
                            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Last: {new Date(sup.lastOrder).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
