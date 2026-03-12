import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

export default function CareersPage() {
    return (
        <div className="min-h-screen pt-32 pb-24" style={{ background: '#FAFAFA', color: '#09090B' }}>
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold font-['Outfit'] mb-6 tracking-tight">Join our Team</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Help us build the software that powers the next generation of hospitality.
                    </p>
                </div>
                
                <div className="mb-16">
                    <h2 className="text-2xl font-bold mb-8 border-b pb-4">Open Roles (Remote)</h2>
                    <div className="flex flex-col gap-4">
                        <Link href="#" className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-xl hover:border-black hover:shadow-md transition-all group">
                            <div>
                                <h3 className="text-lg font-bold">Senior Full Stack Engineer</h3>
                                <p className="text-sm text-gray-500 mt-1">Engineering • Full-time</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-black transform group-hover:translate-x-1 transition-all" />
                        </Link>
                        
                        <Link href="#" className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-xl hover:border-black hover:shadow-md transition-all group">
                            <div>
                                <h3 className="text-lg font-bold">Product Designer</h3>
                                <p className="text-sm text-gray-500 mt-1">Design • Full-time</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-black transform group-hover:translate-x-1 transition-all" />
                        </Link>
                        
                        <Link href="#" className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-xl hover:border-black hover:shadow-md transition-all group">
                            <div>
                                <h3 className="text-lg font-bold">Customer Success Specialist</h3>
                                <p className="text-sm text-gray-500 mt-1">Support • Full-time</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-black transform group-hover:translate-x-1 transition-all" />
                        </Link>
                    </div>
                </div>

                <div className="bg-gray-100 rounded-2xl p-8 text-center">
                    <h3 className="text-xl font-bold mb-3">Don&apos;t see a fit?</h3>
                    <p className="text-gray-600 text-sm mb-6">We&apos;re always looking for talented individuals. Send us your resume anyway.</p>
                    <a href="mailto:careers@myrestromanager.com" className="inline-block px-6 py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
                        Email careers@myrestromanager.com
                    </a>
                </div>
            </div>
        </div>
    );
}
