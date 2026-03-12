export default function CookiePolicyPage() {
    return (
        <div className="min-h-screen pt-32 pb-24" style={{ background: '#FAFAFA', color: '#09090B' }}>
            <div className="max-w-3xl mx-auto px-6">
                <h1 className="text-4xl font-bold font-['Outfit'] mb-6">Cookie Policy</h1>
                <p className="text-sm text-gray-500 mb-12">Last updated: March 2026</p>
                
                <div className="prose prose-gray max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">1. What Are Cookies</h2>
                        <p className="text-gray-600 leading-relaxed">
                            As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. 
                            This page describes what information they gather, how we use it and why we sometimes need to store these cookies. We will also share how you can prevent these cookies from being stored however this may downgrade or &apos;break&apos; certain elements of the sites functionality.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">2. How We Use Cookies</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. 
                            It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">3. The Cookies We Set</h2>
                        <ul className="list-disc pl-6 mt-4 text-gray-600 space-y-2">
                            <li>
                                <strong>Account related cookies:</strong> If you create an account with us then we will use cookies for the management of the signup process and general administration.
                            </li>
                            <li>
                                <strong>Login related cookies:</strong> We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page.
                            </li>
                            <li>
                                <strong>Security cookies:</strong> We use cookies like session tokens (specifically via Supabase Auth) to authenticate and secure your requests across our application.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">4. Disabling Cookies</h2>
                        <p className="text-gray-600 leading-relaxed">
                            You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). 
                            Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. 
                            Specifically, if you disable strictly necessary cookies, you may not be able to log into the myRestro Manager dashboard.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
