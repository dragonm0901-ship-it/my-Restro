'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Scan, ForkKnife } from '@phosphor-icons/react';
import { QRCodeSVG } from 'qrcode.react';

export default function InteractiveDemo() {
    const [step, setStep] = useState<0 | 1 | 2>(0);

    const handleScan = () => {
        setStep(1);
        setTimeout(() => setStep(2), 2500);
        setTimeout(() => setStep(0), 6000);
    };

    return (
        <section id="demo" className="py-24 relative overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black font-['Outfit'] mb-6 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                        Experience the Magic
                    </h2>
                    <p className="text-lg max-w-2xl mx-auto font-['Inter']" style={{ color: 'var(--text-secondary)' }}>
                        See how fast a guest goes from scanning the table QR code to their order appearing instantly in your kitchen.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    
                    {/* Left side: Instructions & Flow */}
                    <div className="space-y-8">
                        {[
                            { step: 0, num: '1', title: 'Guest Scans QR', desc: 'The guest sits down and scans the unique table QR code with their phone camera. No app download required.' },
                            { step: 1, num: '2', title: 'Digital Menu & Ordering', desc: 'They browse a beautifully designed digital menu, customize their dish, and place the order in seconds.' },
                            { step: 2, num: '3', title: 'Instant Kitchen Sync', desc: 'The order fires instantly to your Kitchen Display System (KDS) and the POS, complete with a notification sound.' },
                        ].map((item) => (
                            <div key={item.num} className="p-6 rounded-2xl transition-all duration-300" style={{
                                background: step === item.step ? 'var(--bg-card)' : 'transparent',
                                border: step === item.step ? '1px solid var(--border-hover)' : '1px solid transparent',
                                boxShadow: step === item.step ? 'var(--shadow-card)' : 'none',
                                opacity: step === item.step ? 1 : 0.5,
                            }}>
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{
                                        background: step === item.step ? 'var(--accent)' : 'var(--bg-elevated)',
                                        color: step === item.step ? 'var(--accent-fg)' : 'var(--text-muted)',
                                    }}>{item.num}</div>
                                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                                </div>
                                <p className="pl-14" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                            </div>
                        ))}

                        {step !== 0 && (
                            <button onClick={() => setStep(0)} className="pl-14 text-sm font-bold transition-colors flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                                Restart Demo <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Right side: Interactive Visuals */}
                    <div className="relative h-[600px] flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            
                            {/* Step 0: The QR Code */}
                            {step === 0 && (
                                <motion.div 
                                    key="step0"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="p-6 rounded-3xl shadow-2xl mb-8 relative group" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                                        <QRCodeSVG value="https://myrestromanager.com/demo" size={240} level="H" includeMargin={false} fgColor="var(--text-primary)" bgColor="transparent" />
                                        
                                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap shadow-xl flex items-center gap-2" style={{ background: 'var(--accent)', color: 'var(--accent-fg)', border: '1px solid var(--border)' }}>
                                            Table 12
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={handleScan}
                                        className="btn-primary group relative overflow-hidden flex items-center gap-2"
                                    >
                                        <Scan className="w-5 h-5 relative z-10" weight="bold" />
                                        <span className="relative z-10">Simulate Scan</span>
                                    </button>
                                </motion.div>
                            )}

                            {/* Step 1: The Phone Menu */}
                            {step === 1 && (
                                <motion.div 
                                    key="step1"
                                    initial={{ opacity: 0, scale: 0.95, y: 40 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                                    className="w-[300px] h-[600px] rounded-[40px] shadow-2xl overflow-hidden relative" style={{ background: 'var(--bg-card)', border: '8px solid var(--text-primary)' }}
                                >
                                    {/* Phone Notch */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 rounded-b-xl z-20" style={{ background: 'var(--text-primary)' }} />
                                    
                                    {/* Mock App UI */}
                                    <div className="w-full h-full pt-10" style={{ background: 'var(--bg-card)' }}>
                                        <div className="px-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
                                            <div className="text-xs font-bold mb-1" style={{ color: 'var(--text-muted)' }}>Table 12</div>
                                            <h4 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>The Himalayan Villa</h4>
                                        </div>
                                        <div className="p-4 space-y-4">
                                            <div className="p-3 rounded-2xl shadow-sm flex gap-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                                                <div className="w-16 h-16 rounded-xl animate-pulse shrink-0" style={{ background: 'var(--bg-elevated)' }} />
                                                <div className="flex-1">
                                                    <div className="h-4 w-24 rounded mb-2 animate-pulse" style={{ background: 'var(--bg-elevated)' }} />
                                                    <div className="h-3 w-32 rounded mb-3 animate-pulse" style={{ background: 'var(--bg-elevated)' }} />
                                                    <div className="flex justify-between items-center">
                                                        <div className="h-4 w-12 rounded animate-pulse" style={{ background: 'var(--bg-elevated)' }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Mock Checkout Bar */}
                                        <motion.div 
                                            initial={{ y: 100 }}
                                            animate={{ y: 0 }}
                                            transition={{ delay: 0.8 }}
                                            className="absolute bottom-6 left-4 right-4 p-3 rounded-2xl flex justify-between items-center shadow-lg"
                                            style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
                                        >
                                            <div className="text-sm font-bold">1 item</div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold opacity-80">Rs. 450</span>
                                                <div className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1" style={{ background: 'var(--accent-fg)', color: 'var(--accent)' }}>
                                                    Order <ArrowRight className="w-3 h-3" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: KDS Board Sync */}
                            {step === 2 && (
                                <motion.div 
                                    key="step2"
                                    initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                    transition={{ type: "spring", damping: 25, stiffness: 120 }}
                                    className="w-full max-w-[500px] rounded-2xl shadow-2xl overflow-hidden"
                                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                                >
                                    <div className="px-4 py-3 flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
                                        <div className="flex items-center gap-2 font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                                            <ForkKnife className="w-4 h-4" style={{ color: 'var(--success)' }} />
                                            Kitchen Display (KDS)
                                        </div>
                                        <div className="text-xs bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 animate-pulse">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Live Sync
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <motion.div 
                                            initial={{ x: -50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            className="rounded-xl p-4 shadow-sm"
                                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderLeft: '4px solid var(--success)' }}
                                        >
                                            <div className="flex justify-between items-start mb-3 pb-2" style={{ borderBottom: '1px solid var(--border)' }}>
                                                <div>
                                                    <div className="font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                                        #1042 <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>Table 12</span>
                                                    </div>
                                                    <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Just now • Dine In</div>
                                                </div>
                                                <div className="text-xs font-bold px-2 py-1 rounded" style={{ color: 'var(--warning)', background: 'rgba(245,158,11,0.1)' }}>Pending</div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <div style={{ color: 'var(--text-secondary)' }}><span className="font-bold mr-2" style={{ color: 'var(--text-primary)' }}>1x</span> Momo Steam Buff</div>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <div style={{ color: 'var(--text-secondary)' }}><span className="font-bold mr-2" style={{ color: 'var(--text-primary)' }}>2x</span> Diet Coke</div>
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-3 flex justify-end" style={{ borderTop: '1px solid var(--border)' }}>
                                                <button className="btn-primary text-xs py-2 px-4">
                                                    Start Preparing
                                                </button>
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </section>
    );
}
