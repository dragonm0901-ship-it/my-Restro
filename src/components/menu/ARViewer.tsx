'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    CubeFocus,
    Hand,
    ArrowsOutCardinal,
    ShoppingCartSimple,
    Timer,
    Fire as Flame,
    Warning,
    Info,
} from '@phosphor-icons/react/dist/ssr';

// Load the model-viewer web component
import '@google/model-viewer';

interface ARViewerProps {
    isOpen: boolean;
    onClose: () => void;
    modelSrc: string;
    iosSrc?: string;
    itemName: string;
    itemPrice: number;
    itemDescription: string;
    // Dynamic metadata
    calories?: number;
    prepTime?: number;
    spiceLevels?: string[];
    allergens?: string[];
    isVegetarian?: boolean;
    // Cart integration
    onAddToCart?: () => void;
}

export function ARViewer({
    isOpen,
    onClose,
    modelSrc,
    iosSrc,
    itemName,
    itemPrice,
    itemDescription,
    calories,
    prepTime,
    spiceLevels,
    allergens,
    isVegetarian,
    onAddToCart,
}: ARViewerProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);
    const [showGestureHint, setShowGestureHint] = useState(true);
    const modelRef = useRef<HTMLElement>(null);

    // Listen for model-viewer load and progress events
    useEffect(() => {
        const mv = modelRef.current;
        if (!mv) return;

        const handleLoad = () => {
            setIsLoaded(true);
            setLoadProgress(100);
        };

        const handleProgress = (event: Event) => {
            const detail = (event as CustomEvent).detail;
            if (detail?.totalProgress !== undefined) {
                setLoadProgress(Math.round(detail.totalProgress * 100));
            }
        };

        mv.addEventListener('load', handleLoad);
        mv.addEventListener('progress', handleProgress);

        return () => {
            mv.removeEventListener('load', handleLoad);
            mv.removeEventListener('progress', handleProgress);
        };
    }, [isOpen]);

    // Body scroll lock & state reset
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setIsLoaded(false);
            setLoadProgress(0);
            setShowGestureHint(true);
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Auto-dismiss gesture hint
    useEffect(() => {
        if (isLoaded && showGestureHint) {
            const timer = setTimeout(() => setShowGestureHint(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [isLoaded, showGestureHint]);

    const dismissHint = useCallback(() => setShowGestureHint(false), []);

    // Spice level indicator
    const spiceCount = spiceLevels?.length || 0;
    const spiceDisplay = spiceCount >= 3 ? 'Hot' : spiceCount >= 2 ? 'Medium' : 'Mild';

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center isolate">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
                        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        className="absolute inset-0 bg-black/85"
                        onClick={onClose}
                    />

                    {/* Main Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-4xl h-[88vh] md:h-[82vh] flex flex-col md:flex-row overflow-hidden mx-3 rounded-3xl"
                        style={{
                            background: 'rgba(10, 10, 15, 0.7)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            boxShadow: '0 25px 80px -12px rgba(0,0,0,0.7)',
                        }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-50 p-2.5 rounded-full transition-colors"
                            style={{ background: 'rgba(255,255,255,0.1)' }}
                        >
                            <X className="w-5 h-5 text-white/80" />
                        </button>

                        {/* 3D Model Viewer Area */}
                        <div className="flex-1 relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #111118 0%, #000 50%, #0a0a12 100%)' }}>
                            {/* Corner brackets */}
                            <div className="absolute top-6 left-6 w-6 h-6 border-t-2 border-l-2 border-white/15 rounded-tl-sm" />
                            <div className="absolute top-6 right-6 w-6 h-6 border-t-2 border-r-2 border-white/15 rounded-tr-sm" />
                            <div className="absolute bottom-6 left-6 w-6 h-6 border-b-2 border-l-2 border-white/15 rounded-bl-sm" />
                            <div className="absolute bottom-6 right-6 w-6 h-6 border-b-2 border-r-2 border-white/15 rounded-br-sm" />

                            {/* Model Viewer */}
                            <div className="w-full h-full relative z-10">
                                {/* @ts-expect-error - model-viewer is a custom element */}
                                <model-viewer
                                    ref={modelRef}
                                    src={modelSrc}
                                    ios-src={iosSrc || undefined}
                                    alt={`A 3D model of ${itemName}`}
                                    shadow-intensity="1.2"
                                    shadow-softness="0.8"
                                    camera-controls
                                    auto-rotate
                                    auto-rotate-delay="0"
                                    rotation-per-second="24deg"
                                    ar
                                    ar-modes="webxr scene-viewer quick-look"
                                    environment-image="neutral"
                                    exposure="0.85"
                                    interaction-prompt="none"
                                    style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
                                    onTouchStart={dismissHint}
                                    onMouseDown={dismissHint}
                                >
                                    {/* AR Button (shown on supported devices) */}
                                    <button
                                        slot="ar-button"
                                        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm shadow-xl active:scale-95 transition-transform"
                                        style={{ background: '#fff', color: '#000' }}
                                    >
                                        <CubeFocus className="w-5 h-5" weight="fill" />
                                        Place on your table
                                    </button>
                                {/* @ts-expect-error - model-viewer is a custom element */}
                                </model-viewer>
                            </div>

                            {/* Loading overlay with progress */}
                            <AnimatePresence>
                                {!isLoaded && (
                                    <motion.div
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="absolute inset-0 z-20 flex flex-col items-center justify-center"
                                        style={{ background: 'rgba(10, 10, 15, 0.9)', backdropFilter: 'blur(8px)' }}
                                    >
                                        {/* Animated loading ring */}
                                        <div className="w-28 h-28 relative flex items-center justify-center">
                                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                                                <motion.circle
                                                    cx="50" cy="50" r="42" fill="none" stroke="#fff" strokeWidth="3"
                                                    strokeLinecap="round" strokeDasharray={264}
                                                    animate={{ strokeDashoffset: 264 - (264 * loadProgress) / 100 }}
                                                    transition={{ duration: 0.3 }}
                                                />
                                            </svg>
                                            <span className="text-white font-mono font-bold text-lg">{loadProgress}%</span>
                                        </div>
                                        <p className="text-white/40 text-xs font-mono mt-5 tracking-widest uppercase">
                                            Loading 3D Model
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Gesture hint overlay */}
                            <AnimatePresence>
                                {isLoaded && showGestureHint && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-15 flex items-center justify-center pointer-events-none"
                                    >
                                        <div className="flex flex-col items-center gap-4 p-6 rounded-2xl" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
                                            <div className="flex items-center gap-8">
                                                <div className="text-center">
                                                    <motion.div
                                                        animate={{ rotate: [0, 20, -20, 0] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    >
                                                        <Hand className="w-8 h-8 text-white/60" weight="fill" />
                                                    </motion.div>
                                                    <p className="text-white/40 text-[9px] mt-1 font-medium">Rotate</p>
                                                </div>
                                                <div className="text-center">
                                                    <motion.div
                                                        animate={{ scale: [1, 1.2, 1] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    >
                                                        <ArrowsOutCardinal className="w-8 h-8 text-white/60" weight="fill" />
                                                    </motion.div>
                                                    <p className="text-white/40 text-[9px] mt-1 font-medium">Pinch to zoom</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Info Panel */}
                        <div className="w-full md:w-80 flex flex-col justify-end relative overflow-hidden border-l border-white/5"
                            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)' }}>
                            {/* Grid pattern */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none" />

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="relative z-10 p-6 md:p-8"
                            >
                                {/* Live indicator */}
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-emerald-400 text-[10px] font-mono tracking-widest uppercase">Live 3D Render</span>
                                </div>

                                {/* Item info */}
                                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight font-['Outfit'] mb-2">
                                    {itemName}
                                </h2>
                                <div className="text-xl md:text-2xl font-black text-white mb-4 font-mono">
                                    Rs. {itemPrice}
                                </div>

                                <p className="text-white/40 text-sm leading-relaxed mb-6">
                                    {itemDescription}
                                </p>

                                {/* Dynamic Stats Grid */}
                                <div className="grid grid-cols-2 gap-3 border-t border-white/8 pt-5 mb-5">
                                    {calories !== undefined && (
                                        <div className="p-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                                            <div className="text-white/30 text-[9px] uppercase tracking-wider mb-1 font-bold">Calories</div>
                                            <div className="text-white font-mono font-bold text-sm">{calories} kcal</div>
                                        </div>
                                    )}
                                    {prepTime !== undefined && (
                                        <div className="p-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                                            <div className="text-white/30 text-[9px] uppercase tracking-wider mb-1 font-bold">Prep Time</div>
                                            <div className="text-white font-mono font-bold text-sm flex items-center gap-1">
                                                <Timer className="w-3.5 h-3.5 text-white/40" weight="fill" />
                                                {prepTime} min
                                            </div>
                                        </div>
                                    )}
                                    {spiceLevels && spiceLevels.length > 0 && (
                                        <div className="p-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                                            <div className="text-white/30 text-[9px] uppercase tracking-wider mb-1 font-bold">Spice Level</div>
                                            <div className="text-white font-mono font-bold text-sm flex items-center gap-1.5">
                                                {spiceLevels.map((_, idx) => (
                                                    <Flame key={idx} className="w-3 h-3.5 text-red-500" weight="fill" />
                                                ))}
                                                <span className="text-white/50 text-[10px] ml-0.5">{spiceDisplay}</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="p-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                                        <div className="text-white/30 text-[9px] uppercase tracking-wider mb-1 font-bold">Diet</div>
                                        <div className="text-white font-mono font-bold text-sm">
                                            {isVegetarian ? (
                                                <span className="text-emerald-400 flex items-center gap-1">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Veg
                                                </span>
                                            ) : 'Non-Veg'}
                                        </div>
                                    </div>
                                </div>

                                {/* Allergens */}
                                {allergens && allergens.length > 0 && (
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-5" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)' }}>
                                        <Warning className="w-3.5 h-3.5 text-amber-400 shrink-0" weight="fill" />
                                        <span className="text-[10px] text-amber-300/70">
                                            <span className="font-bold">Allergens:</span> {allergens.join(', ')}
                                        </span>
                                    </div>
                                )}

                                {/* Placeholder info */}
                                <div className="flex items-start gap-2 px-3 py-2 rounded-lg mb-5" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.1)' }}>
                                    <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" weight="fill" />
                                    <span className="text-[9px] text-blue-300/60 leading-relaxed">
                                        3D model is a placeholder preview. Actual dish presentation may vary.
                                    </span>
                                </div>

                                {/* Add to Cart from AR */}
                                {onAddToCart && (
                                    <motion.button
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => { onAddToCart(); onClose(); }}
                                        className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2.5 text-sm transition-all active:shadow-none"
                                        style={{ background: '#fff', color: '#000', boxShadow: '0 4px 20px rgba(255,255,255,0.1)' }}
                                    >
                                        <ShoppingCartSimple className="w-4.5 h-4.5" weight="bold" />
                                        Add to Order · Rs. {itemPrice}
                                    </motion.button>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
