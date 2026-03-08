export default function IntegrationsPage() {
    return (
        <div className="min-h-screen pt-32 pb-24" style={{ background: '#FAFAFA', color: '#09090B' }}>
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold font-['Outfit'] mb-6 tracking-tight">Integrations</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Connect myRestro with the tools you already use. From payments to accounting, we&apos;ve got you covered.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* eSewa */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 flex flex-col items-start">
                        <div className="w-16 h-16 bg-[#61BA46]/10 text-[#61BA46] rounded-2xl flex items-center justify-center font-bold text-xl mb-6">
                            eSewa
                        </div>
                        <h3 className="text-2xl font-bold mb-2">eSewa Payments</h3>
                        <p className="text-gray-500 text-sm mb-6 grow">
                            Accept digital payments directly from customers at the table via QR code or during online checkout.
                        </p>
                        <span className="text-xs font-bold uppercase tracking-wider text-green-600 bg-green-50 px-3 py-1 rounded-full">Active</span>
                    </div>

                    {/* Khalti */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 flex flex-col items-start">
                        <div className="w-16 h-16 bg-[#5C2D91]/10 text-[#5C2D91] rounded-2xl flex items-center justify-center font-bold text-xl mb-6">
                            Khalti
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Khalti Wallet</h3>
                        <p className="text-gray-500 text-sm mb-6 grow">
                            Seamless integration with Khalti for fast and secure digital transactions inside your restaurant.
                        </p>
                        <span className="text-xs font-bold uppercase tracking-wider text-green-600 bg-green-50 px-3 py-1 rounded-full">Active</span>
                    </div>

                    {/* Fonepay Placeholder */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 flex flex-col items-start opacity-70">
                        <div className="w-16 h-16 bg-[#E31E24]/10 text-[#E31E24] rounded-2xl flex items-center justify-center font-bold text-xl mb-6">
                            FP
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Fonepay</h3>
                        <p className="text-gray-500 text-sm mb-6 grow">
                            Interoperable QR payment standard across all major banks in Nepal.
                        </p>
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">Coming Soon</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
