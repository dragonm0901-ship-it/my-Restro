'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useOrdersStore } from '@/stores/useOrdersStore';
import { useTableStore } from '@/stores/useTableStore';
import {
    Bag,
    Armchair,
    Wallet,
    Users,
    ArrowUpRight,
    ArrowDownRight,
    ForkKnife,
    Coffee,
    CheckCircle
} from '@phosphor-icons/react';

/* ─── Minimalist Bar Chart ─── */
function BarChart({ data, height = 200 }: { data: { label: string; value: number }[]; height?: number }) {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(3);
    const max = Math.max(...data.map((d) => d.value), 1);
    const w = 1000, h = height;
    const padding = 20;
    const chartH = h - padding * 2;
    const barW = 48; // width of each bar
    const gap = (w - (data.length * barW)) / (data.length > 1 ? data.length - 1 : 1);

    return (
        <div className="w-full relative mt-4" style={{ height }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="overflow-visible">
                {data.map((d, i) => {
                    const barH = (d.value / max) * chartH;
                    const x = i * (barW + gap);
                    const y = h - padding - barH;
                    const isHovered = hoveredIdx === i;

                    return (
                        <g key={i} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} style={{ cursor: 'pointer' }}>
                            <rect
                                x={x}
                                y={y}
                                width={barW}
                                height={barH}
                                rx="8"
                                fill={isHovered ? 'var(--accent)' : 'var(--chart-2)'}
                                style={{ transition: 'all 0.3s ease' }}
                            />
                            {/* Removed SVG Tooltip to fix squeezing issue */}
                        </g>
                    );
                })}
            </svg>

            {/* HTML Tooltip Overlay to prevent SVG aspect ratio distortion */}
            {data.map((d, i) => {
                const isHovered = hoveredIdx === i;
                const xCenterPct = ((i * (barW + gap) + barW / 2) / w) * 100;
                const barH = (d.value / max) * chartH;
                const y = h - padding - barH;

                return (
                    <AnimatePresence key={`tooltip-${i}`}>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, x: '-50%' }}
                                animate={{ opacity: 1, y: 0, x: '-50%' }}
                                exit={{ opacity: 0, scale: 0.9, x: '-50%' }}
                                className="absolute pointer-events-none flex flex-col items-center z-10"
                                style={{ left: `${xCenterPct}%`, top: Math.max(0, y - 48) }}
                            >
                                <div className="px-3.5 py-1.5 rounded-lg text-sm font-bold shadow-md whitespace-nowrap" style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
                                    NPR {d.value.toLocaleString()}
                                </div>
                                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-8 border-l-transparent border-r-transparent drop-shadow-sm" style={{ borderTopColor: 'var(--text-primary)' }} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                );
            })}
            <div className="flex justify-between mt-4 px-2">
                {data.map((d, i) => (
                    <span key={i} className="text-[13px] font-semibold" style={{ color: hoveredIdx === i ? 'var(--text-primary)' : 'var(--text-muted)' }}>{d.label}</span>
                ))}
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const router = useRouter();
    const orders = useOrdersStore(s => s.orders);
    const tables = useTableStore(s => s.tables);

    // Calculate dynamic stats
    const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString());
    const todaysRevenue = todayOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0);
    const activeOrders = orders.filter(o => o.status !== 'completed');

    const occupiedTables = tables.filter(t => t.status !== 'vacant').length;
    const occupancyRate = tables.length > 0 ? Math.round((occupiedTables / tables.length) * 100) : 0;

    // Estimate walk-ins from live tables or today's orders mapping
    const liveGuests = tables.reduce((sum, t) => sum + (t.guestCount || 0), 0);
    // For a fully accurate walk-in we'd need historical order guest counts, using a scaled mock based on revenue for now alongside live guests
    const totalWalkins = liveGuests + Math.floor(todaysRevenue / 800) || 12;

    // Restaurant Specific KPI Cards
    const kpis = [
        { label: 'Today\'s Revenue', value: todaysRevenue > 0 ? `NPR ${(todaysRevenue / 1000).toFixed(1)}k` : 'NPR 0', icon: Wallet, trend: todaysRevenue > 0 ? '+12%' : '0%', up: true },
        { label: 'Active Orders', value: activeOrders.length.toString(), icon: Bag, trend: activeOrders.length > 0 ? `+${activeOrders.length}` : '0', up: true },
        { label: 'Table Occupancy', value: `${occupancyRate}%`, icon: Armchair, trend: '-2%', up: false },
        { label: 'Total Walk-ins', value: totalWalkins.toString(), icon: Users, trend: '+18%', up: true },
    ];

    // Daily Revenue chart data
    const chartData = [
        { label: 'Mon', value: 35000 },
        { label: 'Tue', value: 42000 },
        { label: 'Wed', value: 38000 },
        { label: 'Thu', value: 55000 },
        { label: 'Fri', value: 72000 },
        { label: 'Sat', value: todaysRevenue > 0 ? todaysRevenue : 85000 },
        { label: 'Sun', value: 64000 },
    ];

    const anim = (i: number) => ({ initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.2, type: 'spring' as const, stiffness: 300, damping: 35 } });

    return (
        <div className="space-y-6 page-enter pb-8">
            {/* Top KPI Cards row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {kpis.map((kpi, i) => (
                    <motion.div key={kpi.label} {...anim(i)} className="rounded-3xl p-5 flex items-center gap-4 card-hover overflow-hidden relative group"
                        style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--border)' }}>
                        <div className="w-14 h-14 rounded-[20px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ background: 'var(--accent-light)' }}>
                            <kpi.icon className="w-7 h-7" weight="fill" style={{ color: 'var(--accent)' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>{kpi.label}</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl lg:text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{kpi.value}</span>
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                                    style={{ background: kpi.up ? 'color-mix(in srgb, var(--success) 15%, transparent)' : 'color-mix(in srgb, var(--danger) 15%, transparent)', color: kpi.up ? 'var(--success)' : 'var(--danger)' }}>
                                    {kpi.trend}
                                    {kpi.up ? <ArrowUpRight className="w-3 h-3" strokeWidth={4} /> : <ArrowDownRight className="w-3 h-3" strokeWidth={4} />}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Middle Row: Reports Chart + Promo Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Reports - Bar Chart */}
                <motion.div {...anim(4)} className="lg:col-span-3 rounded-3xl p-8 card-hover" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--border)' }}>
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Weekly Revenue Flow</h3>
                            <div className="flex items-center gap-3">
                                <p className="text-[34px] font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>NPR 391,000</p>
                            </div>
                        </div>
                    </div>
                    <BarChart data={chartData} />
                </motion.div>

                {/* Promo Banner using Premium Black */}
                <motion.div {...anim(5)} className="lg:col-span-2 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative shadow-lg hover:shadow-xl transition-shadow" style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}>
                    {/* Abstract background shapes */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

                    <div className="relative z-10 space-y-4 pt-1">
                        <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md text-[11px] font-bold tracking-wider rounded-full" style={{ color: 'var(--accent-fg)' }}>UPGRADE</span>
                        <h2 className="text-3xl md:text-[32px] font-bold leading-tight pt-2">Empower your restaurant operations!</h2>
                        <p className="text-sm opacity-80 leading-relaxed font-medium max-w-sm pt-2">Switch to our enterprise tier to unlock multi-branch sync, tailored reports, and advanced inventory.</p>
                    </div>
                    <button onClick={() => router.push('/pricing')} className="relative z-10 mt-10 w-full py-4 font-bold text-[15px] rounded-2xl transition-colors shadow-sm active:scale-[0.98]" style={{ background: 'var(--accent-fg)', color: 'var(--accent)' }}>
                        View Premium Plans
                    </button>
                </motion.div>
            </div>

            {/* Bottom Row: Kitchen Queue + Recent Orders Table */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Kitchen Queue Feed */}
                <motion.div {...anim(6)} className="lg:col-span-2 rounded-3xl p-8 card-hover" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--border)' }}>
                    <h3 className="text-[22px] font-bold mb-8" style={{ color: 'var(--text-primary)' }}>Kitchen Queue</h3>
                    <div className="relative border-l-2 ml-4 mx-2 space-y-9" style={{ borderColor: 'var(--border)' }}>
                        {activeOrders.length === 0 ? (
                            <p className="text-sm font-medium -ml-4" style={{ color: 'var(--text-muted)' }}>No active orders in queue.</p>
                        ) : activeOrders.slice(0, 3).map((order) => {
                            const isReady = order.status === 'ready';
                            const isPrep = order.status === 'preparing';
                            const color = isReady ? 'var(--success)' : isPrep ? 'var(--info)' : 'var(--warning)';
                            const bg = isReady ? 'color-mix(in srgb, var(--success) 15%, transparent)' : isPrep ? 'color-mix(in srgb, var(--info) 15%, transparent)' : 'color-mix(in srgb, var(--warning) 15%, transparent)';
                            const Icon = isReady ? CheckCircle : isPrep ? ForkKnife : Coffee;
                            // eslint-disable-next-line react-hooks/purity
                            const m = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
                            const timeStr = m < 1 ? 'Just now' : `${m}m ago`;
                            const items = order.items.slice(0, 2).map((i: { quantity: number; menu_item: { name: string } }) => `${i.quantity}x ${i.menu_item.name}`).join(', ') + (order.items.length > 2 ? '...' : '');

                            return (
                                <div key={order.id} className="relative pl-8">
                                    <div className="absolute -left-[19px] top-1.5 w-9 h-9 rounded-full border-[5px] flex items-center justify-center bg-white" style={{ borderColor: 'var(--bg-card)' }}>
                                        <div className="w-full h-full rounded-full flex items-center justify-center p-[5px]" style={{ background: bg }}>
                                            <Icon className="w-full h-full" weight="bold" style={{ color: color }} />
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3.5">
                                        <div className="mt-0.5">
                                            <p className="text-[14px] leading-snug" style={{ color: 'var(--text-primary)' }}>
                                                <span className="font-bold">Table {order.tableNumber}</span> • {items}
                                            </p>
                                            <p className="text-xs mt-1 font-medium" style={{ color: 'var(--text-muted)' }}>Ticket created {timeStr}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Recent Orders Table */}
                <motion.div {...anim(7)} className="lg:col-span-3 rounded-3xl p-8 card-hover overflow-hidden" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--border)' }}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-[22px] font-bold" style={{ color: 'var(--text-primary)' }}>Live Orders</h3>
                    </div>
                    <div className="overflow-x-auto hide-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[550px]">
                            <thead>
                                <tr className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                                    <th className="pb-4 pr-4">Order ID</th>
                                    <th className="pb-4 px-4 w-1/4">Time</th>
                                    <th className="pb-4 px-4 w-1/4">Type</th>
                                    <th className="pb-4 px-4 w-1/4">Amount</th>
                                    <th className="pb-4 pl-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { no: '#ORD-901', time: '18:42', type: 'Dine-In (T4)', amount: 'NPR 1,250', status: 'PREPARING' },
                                    { no: '#ORD-902', time: '18:35', type: 'Takeaway', amount: 'NPR 4,810', status: 'READY' },
                                    { no: '#ORD-903', time: '18:20', type: 'Dine-In (T2)', amount: 'NPR 950', status: 'PAID' },
                                ].map((inv, i) => (
                                    <tr key={i} className="text-[14px] border-b last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors" style={{ borderColor: 'var(--border)' }}>
                                        <td className="py-5 pr-4 font-bold" style={{ color: 'var(--text-secondary)' }}>{inv.no}</td>
                                        <td className="py-5 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>{inv.time}</td>
                                        <td className="py-5 px-4 font-bold" style={{ color: 'var(--text-primary)' }}>{inv.type}</td>
                                        <td className="py-5 px-4 font-bold" style={{ color: 'var(--text-primary)' }}>{inv.amount}</td>
                                        <td className="py-5 pl-4 flex justify-end">
                                            <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide flex w-max align-center items-center" style={{
                                                background: inv.status === 'PAID' ? 'color-mix(in srgb, var(--success) 15%, transparent)' : inv.status === 'READY' ? 'color-mix(in srgb, var(--info) 15%, transparent)' : 'color-mix(in srgb, var(--warning) 15%, transparent)',
                                                color: inv.status === 'PAID' ? 'var(--success)' : inv.status === 'READY' ? 'var(--info)' : 'var(--warning)'
                                            }}>
                                                {inv.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
