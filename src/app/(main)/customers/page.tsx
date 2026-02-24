'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    UserCircle as UserCircle, MagnifyingGlass as Search, Plus as Plus,
    Phone as Phone, TrendUp as TrendingUp, Crown as Crown, ShoppingBag as ShoppingBag
} from '@phosphor-icons/react';

interface Customer {
    id: string;
    name: string;
    phone: string;
    visits: number;
    totalSpent: number;
    lastVisit: string;
    favoriteItem: string;
    isVip: boolean;
}

const customers: Customer[] = [
    { id: 'C-001', name: 'Rajesh Hamal', phone: '9841000010', visits: 23, totalSpent: 12500, lastVisit: '2026-02-19', favoriteItem: 'Buff Momo', isVip: true },
    { id: 'C-002', name: 'Srijana Shrestha', phone: '9841000011', visits: 18, totalSpent: 9800, lastVisit: '2026-02-18', favoriteItem: 'Chicken Chowmein', isVip: true },
    { id: 'C-003', name: 'Bikram Thapa', phone: '9841000012', visits: 12, totalSpent: 6200, lastVisit: '2026-02-17', favoriteItem: 'Masala Tea', isVip: false },
    { id: 'C-004', name: 'Anita Sharma', phone: '9841000013', visits: 9, totalSpent: 4800, lastVisit: '2026-02-16', favoriteItem: 'Dal Bhat', isVip: false },
    { id: 'C-005', name: 'Dipesh Karki', phone: '9841000014', visits: 7, totalSpent: 3100, lastVisit: '2026-02-15', favoriteItem: 'Jhol Momo', isVip: false },
    { id: 'C-006', name: 'Sumina Rai', phone: '9841000015', visits: 15, totalSpent: 8400, lastVisit: '2026-02-18', favoriteItem: 'Lassi', isVip: true },
    { id: 'C-007', name: 'Nabin KC', phone: '9841000016', visits: 5, totalSpent: 2200, lastVisit: '2026-02-14', favoriteItem: 'Kothey Momo', isVip: false },
    { id: 'C-008', name: 'Prakriti Gurung', phone: '9841000017', visits: 11, totalSpent: 5600, lastVisit: '2026-02-17', favoriteItem: 'Chicken Sekuwa', isVip: false },
];

export default function CustomersPage() {
    const [search, setSearch] = useState('');


    const filtered = customers.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
    );

    const totalCustomers = customers.length;
    const vipCount = customers.filter((c) => c.isVip).length;
    const avgSpend = customers.reduce((s, c) => s + c.totalSpent, 0) / totalCustomers;

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Customers</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{totalCustomers} registered loyalty members.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-transform active:scale-95"
                    style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
                    <Plus className="w-4 h-4" weight="bold" /> Add Customer
                </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="rounded-3xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
                    <UserCircle className="w-6 h-6 mb-3" weight="fill" style={{ color: 'var(--text-primary)' }} />
                    <p className="text-2xl font-bold tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>{totalCustomers}</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Total Customers</p>
                </div>
                <div className="rounded-3xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
                    <Crown className="w-6 h-6 mb-3" weight="fill" style={{ color: 'var(--warning)' }} />
                    <p className="text-2xl font-bold tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>{vipCount}</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>VIP Members</p>
                </div>
                <div className="rounded-3xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
                    <TrendingUp className="w-6 h-6 mb-3" weight="bold" style={{ color: 'var(--success)' }} />
                    <p className="text-2xl font-bold tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>Rs. {avgSpend.toFixed(0)}</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Avg Spend</p>
                </div>
            </div>

            <div className="relative max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" weight="bold" style={{ color: 'var(--text-muted)' }} />
                <input type="text" placeholder="Search by name or phone..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-1 transition-all"
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            </div>

            {/* Customer Cards */}
            <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                {filtered.map((c, i) => (
                    <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                        className="flex items-center gap-3 px-4 py-3"
                        style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold text-white relative"
                            style={{ background: 'var(--accent)' }}>
                            {c.name.split(' ').map((n) => n[0]).join('')}
                            {c.isVip && (
                                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                                    style={{ background: 'var(--warning)', border: '2px solid var(--bg-card)' }}>
                                    <Crown className="w-2 h-2 text-white" weight="fill" />
                                </span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-semibold" style={{ color: 'var(--text-primary)' }}>{c.name}</span>
                                {c.isVip && (
                                    <span className="text-[8px] font-bold px-1 py-0.5 rounded" style={{ background: 'rgba(232,168,56,0.1)', color: 'var(--warning)' }}>VIP</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[9px]" style={{ color: 'var(--text-muted)' }}>
                                <span className="flex items-center gap-0.5"><Phone className="w-2.5 h-2.5" weight="fill" /> {c.phone}</span>
                                <span>·</span>
                                <span className="flex items-center gap-0.5"><ShoppingBag className="w-2.5 h-2.5" weight="fill" /> {c.visits} visits</span>
                                <span>·</span>
                                <span>♥ {c.favoriteItem}</span>
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-[11px] font-bold" style={{ color: 'var(--accent-text)' }}>Rs. {c.totalSpent.toFixed(0)}</p>
                            <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>
                                {new Date(c.lastVisit).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
