import Link from 'next/link';

export default function DocumentationPlaceholder() {
    return (
        <div className="min-h-screen pt-32 pb-24 flex items-center justify-center text-center" style={{ background: '#FAFAFA', color: '#09090B' }}>
            <div className="max-w-lg px-6">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-gray-400">
                    {"{ }"}
                </div>
                <h1 className="text-3xl font-bold font-['Outfit'] mb-4">Documentation Hub</h1>
                <p className="text-gray-500 mb-8">Detailed developer documentation, quickstarts, and comprehensive guides are currently being migrated to this portal.</p>
                <Link href="/" className="inline-block bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                    Return to Homepage
                </Link>
            </div>
        </div>
    );
}
