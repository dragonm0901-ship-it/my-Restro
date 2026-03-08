'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendUp, Coins } from '@phosphor-icons/react';

export default function ROICalculator() {
    const [tables, setTables] = useState(15);
    const [orderValue, setOrderValue] = useState(800);

    const currentOrdersPerTablePerDay = 3;
    const efficiencyBoostPercentage = 0.15;
    
    const currentDailyRevenue = tables * currentOrdersPerTablePerDay * orderValue;
    const extraDailyRevenue = currentDailyRevenue * efficiencyBoostPercentage;
    const extraMonthlyRevenue = extraDailyRevenue * 30;

    return (
        <section className="py-24 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at center, var(--border) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            
            <div className="max-w-5xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>
                        <Calculator size={32} weight="duotone" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black font-['Outfit'] mb-6 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                        Calculate Your ROI
                    </h2>
                    <p className="text-lg max-w-2xl mx-auto font-['Inter']" style={{ color: 'var(--text-secondary)' }}>
                        Faster ordering means faster table turnover. See how much extra revenue your restaurant could generate simply by switching to myRestro.
                    </p>
                </div>

                <div className="rounded-3xl p-8 md:p-12 shadow-xl grid md:grid-cols-2 gap-12 items-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    
                    {/* Left: Interactive Sliders */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <label className="text-sm font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>Average Tables</label>
                                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>How many tables do you have?</span>
                                </div>
                                <div className="text-2xl font-black font-mono" style={{ color: 'var(--text-primary)' }}>{tables}</div>
                            </div>
                            <input 
                                type="range" 
                                min="5" 
                                max="100" 
                                value={tables} 
                                onChange={(e) => setTables(Number(e.target.value))}
                                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-accent"
                                style={{ background: 'var(--bg-elevated)' }}
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <label className="text-sm font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>Avg. Order Value (NPR)</label>
                                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Average spend per table</span>
                                </div>
                                <div className="text-2xl font-black font-mono" style={{ color: 'var(--text-primary)' }}>Rs. {orderValue}</div>
                            </div>
                            <input 
                                type="range" 
                                min="200" 
                                max="5000" 
                                step="50"
                                value={orderValue} 
                                onChange={(e) => setOrderValue(Number(e.target.value))}
                                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-accent"
                                style={{ background: 'var(--bg-elevated)' }}
                            />
                        </div>

                        <div className="p-4 rounded-xl flex gap-4 mt-8" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                            <TrendUp className="w-6 h-6 shrink-0 mt-0.5" style={{ color: 'var(--success)' }} />
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                Industry data shows Digital QR Menus increase table turnover speed by an average of <strong style={{ color: 'var(--text-primary)' }}>15%</strong>.
                            </p>
                        </div>
                    </div>

                    {/* Right: The Output */}
                    <div className="relative">
                        <motion.div 
                            key={extraMonthlyRevenue}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="rounded-3xl p-8 text-center relative overflow-hidden group"
                            style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
                        >
                            <Coins className="w-12 h-12 mx-auto mb-6 opacity-60 group-hover:scale-110 transition-transform duration-500" />
                            
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-2 opacity-70">Estimated Extra Monthly Revenue</h3>
                            
                            <div className="text-4xl md:text-5xl font-black font-mono tracking-tight mb-4">
                                Rs. {Math.round(extraMonthlyRevenue).toLocaleString()}
                            </div>
                            
                            <p className="text-sm opacity-60">
                                Based on serving just 3 distinct groups per table per day.
                            </p>

                            <button className="w-full mt-8 font-bold py-4 rounded-xl transition-all hover:opacity-90" style={{ background: 'var(--accent-fg)', color: 'var(--accent)' }}>
                                Start Your Free Trial
                            </button>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
