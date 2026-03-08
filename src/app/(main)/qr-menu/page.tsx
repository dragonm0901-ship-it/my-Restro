'use client';

import { useState, useRef, useEffect } from 'react';
import { QrCode, Link as LinkIcon, DownloadSimple, Palette, Eye, Hash, PaintBrush } from '@phosphor-icons/react/dist/ssr';
import { QRCodeCanvas } from 'qrcode.react';
import toast from 'react-hot-toast';

export default function QRMenuBuilderPage() {
    const [activeTab, setActiveTab] = useState<'design' | 'preview'>('design');
    const [primaryColor, setPrimaryColor] = useState('#09090B');
    const [tableNumber, setTableNumber] = useState('12');
    const [baseUrl, setBaseUrl] = useState('');
    
    // We use a ref to target the canvas for downloading
    const qrRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Only safely access window in useEffect and avoid sync cascading updates
        const timer = setTimeout(() => {
            setBaseUrl(window.location.origin);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    // The dynamic URL this QR code points to
    const targetUrl = `${baseUrl}/customer-menu?table=${tableNumber || '1'}`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(targetUrl);
            toast.success('Link copied to clipboard!');
        } catch {
            toast.error('Failed to copy link');
        }
    };

    const handleDownloadQR = () => {
        if (!qrRef.current) return;
        
        // Find the canvas element inside our ref container
        const canvas = qrRef.current.querySelector('canvas');
        if (!canvas) {
            toast.error('QR Code not ready');
            return;
        }

        // Convert the canvas data to an image URL
        const pngUrl = canvas
            .toDataURL('image/png')
            .replace('image/png', 'image/octet-stream');
        
        // Trigger generic browser download
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `table-${tableNumber || '1'}-menu-qr.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        toast.success('QR Code downloaded!');
    };

    return (
        <div className="space-y-6 page-enter pb-8 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>QR Menu Builder</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Design your customer-facing digital menu and generate table-specific QR codes.</p>
                </div>
                <div className="flex p-1 rounded-xl" style={{ background: 'var(--bg-input)' }}>
                    <button onClick={() => setActiveTab('design')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'design' ? 'shadow-sm' : 'opacity-70'}`} style={activeTab === 'design' ? { background: 'var(--text-primary)', color: 'var(--bg-primary)' } : { color: 'var(--text-secondary)' }}>
                        <Palette className="w-4 h-4" /> Design Menu
                    </button>
                    <button onClick={() => setActiveTab('preview')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'preview' ? 'shadow-sm' : 'opacity-70'}`} style={activeTab === 'preview' ? { background: 'var(--text-primary)', color: 'var(--bg-primary)' } : { color: 'var(--text-secondary)' }}>
                        <Eye className="w-4 h-4" /> Live Preview
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* Configuration Panel */}
                <div className="lg:col-span-1 space-y-6 overflow-y-auto hide-scrollbar pr-2">
                    {/* Brand Settings */}
                    <div className="p-6 rounded-3xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
                        <div className="flex items-center gap-3 mb-6">
                            <PaintBrush className="w-5 h-5" weight="fill" style={{ color: 'var(--text-primary)' }} />
                            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Brand Settings</h3>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Primary Color</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-10 h-10 p-0 border-0 rounded cursor-pointer shrink-0" />
                                    <div className="flex-1 px-3 py-2 rounded-lg border text-sm font-medium font-mono" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                                        {primaryColor}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Restaurant Logo (Placeholder)</label>
                                <div className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:opacity-80 transition-colors" style={{ borderColor: 'var(--border)' }}>
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: primaryColor }}>
                                        <span className="text-white text-xs font-bold font-['Outfit']">mR</span>
                                    </div>
                                    <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Updating brand propagates to mock</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* QR Code Generation */}
                    <div className="p-6 rounded-3xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
                        <div className="flex items-center gap-3 mb-6">
                            <QrCode className="w-5 h-5" weight="fill" style={{ color: 'var(--text-primary)' }} />
                            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Generate Codes</h3>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Table Number / Identifier</label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                                    <input
                                        type="text"
                                        value={tableNumber}
                                        onChange={(e) => setTableNumber(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm font-bold border outline-none focus:border-gray-500 transition-shadow"
                                        style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-center p-6 bg-white rounded-2xl border" style={{ borderColor: 'var(--border)' }}>
                                {/* Real QR Code Rendering */}
                                <div className="p-2 border-4 border-black rounded-xl" ref={qrRef}>
                                    {baseUrl ? (
                                        <QRCodeCanvas
                                            value={targetUrl}
                                            size={160}
                                            bgColor={"#ffffff"}
                                            fgColor={primaryColor}
                                            level={"Q"}
                                            includeMargin={false}
                                        />
                                    ) : (
                                        <div className="w-[160px] h-[160px] bg-gray-100 flex items-center justify-center text-xs text-gray-400">Loading...</div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button 
                                    onClick={handleCopyLink}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-colors hover:opacity-80 font-bold text-sm"
                                    style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
                                >
                                    <LinkIcon className="w-4 h-4" /> Copy Link
                                </button>
                                <button 
                                    onClick={handleDownloadQR}
                                    className="flex-2 flex items-center justify-center gap-2 py-3 px-3 rounded-xl transition-all active:scale-[0.98] font-bold text-sm" 
                                    style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}
                                >
                                    <DownloadSimple className="w-4 h-4" weight="bold" /> Download QR
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Phone Preview Panel */}
                <div className="lg:col-span-2 rounded-3xl p-8 flex items-center justify-center overflow-hidden border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)' }}>
                    <div className="relative w-[320px] h-[650px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-8 shrink-0" style={{ borderColor: 'var(--border)' }}>
                        {/* iPhone Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 rounded-b-2xl z-20" style={{ background: 'var(--border)' }} />

                        {/* Live CSS Preview App */}
                        <div className="w-full h-full overflow-y-auto hide-scrollbar bg-gray-50 relative pb-20">
                            {/* App Header */}
                            <div className="pt-12 px-5 pb-4 bg-white sticky top-0 z-10 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: primaryColor }}>
                                        <span className="text-white text-[10px] font-bold font-['Outfit']">mR</span>
                                    </div>
                                    <div className="px-3 py-1 rounded-full text-[10px] font-bold" style={{ background: 'var(--warning)', color: '#fff' }}>
                                        Table {tableNumber || '12'}
                                    </div>
                                </div>
                                <h2 className="text-xl font-black text-gray-900 tracking-tight">Digital Menu</h2>
                            </div>

                            {/* Menu Categories (Mock) */}
                            <div className="px-5 mt-4 flex gap-2 overflow-x-auto hide-scrollbar">
                                {['Starters', 'Mains', 'Drinks'].map((cat, i) => (
                                    <div key={cat} className="px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap" style={{ background: i === 0 ? primaryColor : 'white', color: i === 0 ? '#fff' : '#666', border: i !== 0 ? '1px solid #eee' : 'none' }}>
                                        {cat}
                                    </div>
                                ))}
                            </div>

                            {/* Menu Items (Mock) */}
                            <div className="px-5 mt-6 space-y-4">
                                {[
                                    { n: 'Truffle Fries', p: 'NPR 450', d: 'Crispy fries tossed in truffle oil.' },
                                    { n: 'Caesar Salad', p: 'NPR 650', d: 'Fresh romaine with parmesan.' },
                                    { n: 'Chicken Wings', p: 'NPR 800', d: 'Spicy buffalo wings (6pcs).' }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                                        <div className="w-16 h-16 bg-gray-200 rounded-xl" />
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-gray-900 mb-0.5">{item.n}</h4>
                                            <p className="text-[10px] font-medium text-gray-500 mb-1 leading-tight">{item.d}</p>
                                            <p className="text-xs font-black" style={{ color: primaryColor }}>{item.p}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Floating Action Bar */}
                            <div className="absolute bottom-5 left-5 right-5">
                                <button className="w-full py-4 rounded-2xl text-sm font-bold shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95" style={{ background: primaryColor, color: '#fff' }}>
                                    View Cart (0)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
