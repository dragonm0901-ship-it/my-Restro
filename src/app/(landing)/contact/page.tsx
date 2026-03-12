export default function ContactPage() {
    return (
        <div className="min-h-screen pt-32 pb-24" style={{ background: '#FAFAFA', color: '#09090B' }}>
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold font-['Outfit'] mb-6 tracking-tight">Contact Us</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Have a question about pricing, integrations, or need technical support? 
                        Our team is here to help.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-3xl mx-auto">
                    {/* Form Side */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">Full Name</label>
                                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Email Address</label>
                                <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Message</label>
                                <textarea rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 resize-none" placeholder="How can we help?"></textarea>
                            </div>
                            <button type="button" className="w-full bg-black text-white rounded-xl py-3 text-sm font-bold mt-2 hover:bg-gray-800 transition-colors">
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Information Side */}
                    <div className="flex flex-col justify-center">
                        <div className="mb-8">
                            <h3 className="text-lg font-bold mb-2">Sales Inquiries</h3>
                            <p className="text-gray-500 text-sm mb-1">Interested in using myRestro Manager for your restaurant?</p>
                            <a href="mailto:sales@myrestromanager.com" className="text-sm font-bold text-blue-600 hover:underline">sales@myrestromanager.com</a>
                        </div>
                        
                        <div className="mb-8">
                            <h3 className="text-lg font-bold mb-2">Technical Support</h3>
                            <p className="text-gray-500 text-sm mb-1">Need help with your current setup?</p>
                            <a href="mailto:support@myrestromanager.com" className="text-sm font-bold text-blue-600 hover:underline">support@myrestromanager.com</a>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-2">Office Headquarters</h3>
                            <p className="text-gray-500 text-sm mb-1">123 Tech Avenue</p>
                            <p className="text-gray-500 text-sm mb-1">Kathmandu, Nepal</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
