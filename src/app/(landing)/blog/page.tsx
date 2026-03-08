export default function BlogPage() {
    return (
        <div className="min-h-screen pt-32 pb-24" style={{ background: '#FAFAFA', color: '#09090B' }}>
            <div className="max-w-5xl mx-auto px-6">
                <div className="mb-16">
                    <h1 className="text-5xl font-bold font-['Outfit'] mb-6 tracking-tight">The myRestro Blog</h1>
                    <p className="text-xl text-gray-500">
                        Insights, product updates, and strategies for restaurant growth.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Placeholder Articles */}
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="w-full aspect-4/3 bg-gray-200 rounded-2xl mb-4 overflow-hidden relative">
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                                <span>Product</span>
                                <span>•</span>
                                <span>March {i + 1}, 2026</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                                Introducing the New Kitchen Display System
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2">
                                Discover how our new real-time KDS board can reduce your ticket times by up to 30% and eliminate lost paper tickets entirely.
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
