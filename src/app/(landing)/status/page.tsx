export default function StatusPage() {
    return (
        <div className="min-h-screen pt-32 pb-24" style={{ background: '#FAFAFA', color: '#09090B' }}>
            <div className="max-w-3xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold font-['Outfit'] tracking-tight">System Status</h1>
                        <p className="text-gray-500 mt-2">Current status of myRestro services and APIs.</p>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200 font-medium">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                        All Systems Operational
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-12">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <span className="font-bold">Core API</span>
                        <span className="text-green-600 text-sm font-medium">Operational</span>
                    </div>
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <span className="font-bold">Dashboard & Web App</span>
                        <span className="text-green-600 text-sm font-medium">Operational</span>
                    </div>
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <span className="font-bold">Database (Supabase)</span>
                        <span className="text-green-600 text-sm font-medium">Operational</span>
                    </div>
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <span className="font-bold">eSewa Webhooks</span>
                        <span className="text-green-600 text-sm font-medium">Operational</span>
                    </div>
                    <div className="px-6 py-4 flex justify-between items-center">
                        <span className="font-bold">Khalti Webhooks</span>
                        <span className="text-green-600 text-sm font-medium">Operational</span>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-6">Past Incidents</h2>
                <div className="text-gray-500 text-sm italic py-8 text-center border-t border-gray-200">
                    No incidents reported in the last 30 days.
                </div>
            </div>
        </div>
    );
}
