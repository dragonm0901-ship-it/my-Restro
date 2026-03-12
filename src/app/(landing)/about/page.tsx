export default function AboutPage() {
    return (
        <div className="min-h-screen pt-32 pb-24" style={{ background: '#FAFAFA', color: '#09090B' }}>
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold font-['Outfit'] mb-6 tracking-tight">About myRestro Manager</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        We are on a mission to modernize restaurant operations globally, bringing digital efficiency to kitchens, tables, and management.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Founded in 2026, myRestro Manager started from a simple observation: while dining out is a joy, running a restaurant is incredibly complex. Disconnected systems, paper tickets, and manual billing were slowing down great hospitality.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            We built an all-in-one digital platform that bridges the gap between the front-of-house, the kitchen, and the back-office management. From digital QR ordering to Kitchen Display Systems (KDS) and seamless payment gateway integrations, we provide the tools needed to scale.
                        </p>
                    </div>
                    <div className="bg-gray-100 rounded-2xl aspect-square flex items-center justify-center">
                        <span className="text-gray-400 font-medium">Image Placeholder</span>
                    </div>
                </div>

                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-12">Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-xl font-bold mb-3">Simplicity</h3>
                            <p className="text-gray-500 text-sm">Technology should get out of the way so you can focus on the food and the guests.</p>
                        </div>
                        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-xl font-bold mb-3">Reliability</h3>
                            <p className="text-gray-500 text-sm">During a busy Friday night dinner rush, your point-of-sale simply cannot fail.</p>
                        </div>
                        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-xl font-bold mb-3">Innovation</h3>
                            <p className="text-gray-500 text-sm">We constantly release new features like real-time KDS and integrated webhooks.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
