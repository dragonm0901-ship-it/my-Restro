export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen pt-32 pb-24" style={{ background: '#FAFAFA', color: '#09090B' }}>
            <div className="max-w-3xl mx-auto px-6">
                <h1 className="text-4xl font-bold font-['Outfit'] mb-6">Terms of Service</h1>
                <p className="text-sm text-gray-500 mb-12">Last updated: March 2026</p>
                
                <div className="prose prose-gray max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
                        <p className="text-gray-600 leading-relaxed">
                            By accessing or using the myRestro Manager service, you agree to be bound by these Terms of Service. 
                            If you disagree with any part of the terms, then you do not have permission to access the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
                        <p className="text-gray-600 leading-relaxed">
                            myRestro Manager provides a digital restaurant management platform including point of sale, 
                            kitchen display systems, digital order menus, and administrative dashboards. 
                            The service operates as a Software as a Service (SaaS).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">3. Accounts and Subscriptions</h2>
                        <ul className="list-disc pl-6 mt-4 text-gray-600 space-y-2">
                            <li>You must provide accurate and complete information when creating an account.</li>
                            <li>You are responsible for safeguarding the password that you use to access the Service.</li>
                            <li>We offer various subscription tiers. Billing occurs securely via third-party gateways (eSewa, Khalti).</li>
                            <li>Subscription fees are non-refundable except where expressly required by law.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">4. Acceptable Use</h2>
                        <p className="text-gray-600 leading-relaxed">
                            You agree not to use the Service:
                        </p>
                        <ul className="list-disc pl-6 mt-4 text-gray-600 space-y-2">
                            <li>In any way that violates any applicable national or international law or regulation.</li>
                            <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.</li>
                            <li>To transmit, or procure the sending of, any advertising or promotional material, including any &quot;junk mail&quot;, &quot;chain letter,&quot; &quot;spam,&quot; or any other similar solicitation.</li>
                            <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity.</li>
                        </ul>
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-bold mb-4">5. Data and Intellectual Property</h2>
                        <p className="text-gray-600 leading-relaxed">
                            The Service and its original content (excluding Content provided by you), features and functionality are and will remain the exclusive property of myRestro Manager and its licensors.
                            You retain all rights to the menu and customer data you input into the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
                        <p className="text-gray-600 leading-relaxed">
                            In no event shall myRestro Manager, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                            be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, 
                            loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
