'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CubeFocus } from '@phosphor-icons/react/dist/ssr';

// Load the model-viewer web component locally only
// We use a regular script tag approach or dynamic import in the parent to avoid SSR issues
// For this component, we assume @google/model-viewer is imported in a way that registers the custom element
import '@google/model-viewer';

interface ARViewerProps {
    isOpen: boolean;
    onClose: () => void;
    modelSrc: string;
    itemName: string;
    itemPrice: number;
    itemDescription: string;
}

export function ARViewer({ isOpen, onClose, modelSrc, itemName, itemPrice, itemDescription }: ARViewerProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const modelRef = useRef<HTMLElement>(null);

    // Properly listen for model-viewer custom 'load' event
    useEffect(() => {
        const mv = modelRef.current;
        if (!mv) return;

        const handleLoad = () => setIsLoaded(true);
        mv.addEventListener('load', handleLoad);

        return () => {
            mv.removeEventListener('load', handleLoad);
        };
    }, [isOpen]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsLoaded(false); // Reset load state
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center isolate">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
                        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        className="absolute inset-0 bg-black/80"
                        onClick={onClose}
                    />

                    {/* Main AR Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-4xl h-[85vh] md:h-[80vh] flex flex-col md:flex-row bg-zinc-900/50 border border-white/10 rounded-3xl overflow-hidden shadow-2xl mx-4"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* 3D Model Viewer Area */}
                        <div className="flex-1 relative bg-linear-to-br from-zinc-800 to-black overflow-hidden flex items-center justify-center">
                            
                            {/* Futuristic corner brackets */}
                            <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-accent opacity-50" />
                            <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-accent opacity-50" />
                            <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-accent opacity-50" />
                            <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-accent opacity-50" />

                            <div className="w-full h-full relative z-10">
                                {/* @ts-expect-error - model-viewer is a custom element */}
                                <model-viewer
                                    ref={modelRef}
                                    src={modelSrc}
                                    alt={`A 3D model of ${itemName}`}
                                    shadow-intensity="1"
                                    camera-controls
                                    auto-rotate
                                    ar
                                    environment-image="neutral"
                                    style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
                                >
                                    {/* AR Button styling overrides inside model-viewer slotted content */}
                                    <button slot="ar-button" className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-xl hover:scale-105 transition-transform">
                                        <CubeFocus className="w-5 h-5" weight="fill" />
                                        View in your space
                                    </button>
                                {/* @ts-expect-error - model-viewer is a custom element */}
                                </model-viewer>
                            </div>

                            {/* Scanning overlay while loading */}
                            <AnimatePresence>
                                {!isLoaded && (
                                    <motion.div
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-900/80 backdrop-blur-sm"
                                    >
                                        <div className="w-32 h-32 relative flex items-center justify-center">
                                            <motion.div 
                                                animate={{ rotate: 360 }} 
                                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                                className="absolute inset-0 border-2 border-dashed border-accent/50 rounded-full"
                                            />
                                            <motion.div 
                                                animate={{ scale: [1, 1.2, 1] }} 
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                className="w-4 h-4 bg-accent rounded-full shadow-[0_0_20px_var(--accent)]"
                                            />
                                        </div>
                                        <p className="text-accent text-sm font-mono mt-6 tracking-widest uppercase">Initializing Mesh...</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Info Panel (Futuristic UI) */}
                        <div className="w-full md:w-80 bg-black/60 backdrop-blur-xl border-l border-white/10 p-8 flex flex-col justify-end relative overflow-hidden">
                            {/* Grid background effect */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none" />
                            
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="relative z-10"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-green-500 text-xs font-mono tracking-widest uppercase">Live Render</span>
                                </div>
                                
                                <h2 className="text-3xl font-black text-white tracking-tight mb-2 font-['Outfit']">{itemName}</h2>
                                <div className="text-2xl font-bold text-accent mb-6 font-mono">Rs. {itemPrice}</div>
                                
                                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                                    {itemDescription}
                                </p>

                                {/* Mock nutritional or sci-fi stats */}
                                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                                    <div>
                                        <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Calories</div>
                                        <div className="text-white font-mono font-medium">450 kcal</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Prep Time</div>
                                        <div className="text-white font-mono font-medium">15 min</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Spice Level</div>
                                        <div className="text-white font-mono font-medium flex items-center gap-1">
                                            <span className="w-1.5 h-3 bg-red-500 rounded-sm" />
                                            <span className="w-1.5 h-3 bg-red-500 rounded-sm" />
                                            <span className="w-1.5 h-3 bg-white/20 rounded-sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Allergens</div>
                                        <div className="text-white font-mono font-medium">None</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
