'use client';

import { Play } from '@phosphor-icons/react';

export default function VideoExplainer() {
    return (
        <section className="py-24 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
            <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
                <h2 className="text-3xl md:text-5xl font-black font-['Outfit'] mb-6 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    See It In Action
                </h2>
                <p className="text-lg max-w-2xl mx-auto font-['Inter'] mb-12" style={{ color: 'var(--text-secondary)' }}>
                    Watch how myRestro Manager synchronizes the entire dining experience from the moment a guest sits down to when the food arrives.
                </p>

                {/* Video container */}
                <div className="relative w-full aspect-video bg-zinc-900 rounded-3xl border border-zinc-200 shadow-2xl overflow-hidden group cursor-pointer">
                    
                    {/* Placeholder image */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2674&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity duration-700" />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-80" />

                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-zinc-900 text-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 border border-zinc-700">
                            <Play size={32} weight="fill" className="ml-1" />
                        </div>
                    </div>

                    {/* Faux progress bar */}
                    <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                            <Play size={14} weight="fill" className="text-white" />
                        </div>
                        <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <div className="w-1/3 h-full bg-white relative">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow" />
                            </div>
                        </div>
                        <div className="text-xs font-mono text-white/80">0:45 / 2:30</div>
                    </div>
                </div>
            </div>
        </section>
    );
}

