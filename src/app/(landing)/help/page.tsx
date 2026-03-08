export default function HelpCenterPage() {
    return (
        <div className="min-h-screen pt-32 pb-24" style={{ background: '#FAFAFA', color: '#09090B' }}>
            <div className="max-w-4xl mx-auto px-6 text-center">
                <h1 className="text-5xl font-bold font-['Outfit'] mb-6 tracking-tight">Help Center</h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-16">
                    Find answers to common questions and learn how to get the most out of myRestro.
                </p>

                <div className="max-w-xl mx-auto mb-16 relative">
                    <input 
                        type="text" 
                        placeholder="Search for articles, guides, or FAQs..." 
                        className="w-full bg-white border border-gray-200 rounded-full px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-black transition-colors cursor-pointer">
                        <h3 className="text-xl font-bold mb-2">Getting Started</h3>
                        <p className="text-gray-500 text-sm">Setting up your restaurant, adding menus, and inviting staff.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-black transition-colors cursor-pointer">
                        <h3 className="text-xl font-bold mb-2">Point of Sale (POS)</h3>
                        <p className="text-gray-500 text-sm">Managing orders, applying discounts, and split billing.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-black transition-colors cursor-pointer">
                        <h3 className="text-xl font-bold mb-2">Kitchen Display System</h3>
                        <p className="text-gray-500 text-sm">How to use the KDS to manage tickets and improve prep times.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-black transition-colors cursor-pointer">
                        <h3 className="text-xl font-bold mb-2">Billing & Payments</h3>
                        <p className="text-gray-500 text-sm">Connecting eSewa/Khalti, managing your subscription, and invoices.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
