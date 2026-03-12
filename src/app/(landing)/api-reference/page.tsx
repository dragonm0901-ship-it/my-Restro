export default function ApiReferencePlaceholder() {
    return (
        <div className="min-h-screen pt-32 pb-24 flex items-center justify-center text-center" style={{ background: '#FAFAFA', color: '#09090B' }}>
            <div className="max-w-lg px-6">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-blue-500">
                    {"API"}
                </div>
                <h1 className="text-3xl font-bold font-['Outfit'] mb-4">API Reference</h1>
                <p className="text-gray-500 mb-8">Full REST and GraphQL API references for integrating myRestro Manager with third-party systems are available upon request for Enterprise customers.</p>
                <a href="/contact" className="inline-block bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                    Contact Sales
                </a>
            </div>
        </div>
    );
}
