'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft as ArrowLeft, DeviceMobile as Smartphone } from '@phosphor-icons/react';
import { LogoIcon } from '@/components/Logo';
import Link from 'next/link';
import QRCode from 'qrcode';

export default function QRLoginPage() {
    const [qrDataUrl, setQrDataUrl] = useState('');
    const loginUrl = typeof window !== 'undefined' ? `${window.location.origin}/login` : '';

    useEffect(() => {
        if (loginUrl) {
            QRCode.toDataURL(loginUrl, {
                width: 280,
                margin: 2,
                color: { dark: '#ffffff', light: '#00000000' },
                errorCorrectionLevel: 'M',
            }).then(setQrDataUrl);
        }
    }, [loginUrl]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-primary)' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-sm rounded-2xl p-6 text-center"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
                {/* Logo */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-2" style={{ background: 'var(--accent)' }}>
                        <LogoIcon size={24} style={{ color: 'var(--accent-fg)' }} />
                    </div>
                    <h1 className="text-lg font-bold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>
                        Scan to Login
                    </h1>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        Point your phone camera at the QR code
                    </p>
                </div>

                {/* QR Code */}
                <div className="relative mb-6">
                    <div className="w-64 h-64 mx-auto rounded-2xl flex items-center justify-center overflow-hidden"
                        style={{ background: 'var(--bg-input)', border: '2px solid var(--border)' }}>
                        {qrDataUrl ? (
                            <motion.img
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                src={qrDataUrl}
                                alt="Login QR Code"
                                className="w-56 h-56"
                            />
                        ) : (
                            <div className="animate-pulse w-40 h-40 rounded-lg" style={{ background: 'var(--bg-elevated)' }} />
                        )}
                    </div>
                    {/* Corner decorations */}
                    <div className="absolute top-2 left-[calc(50%-130px)] w-5 h-5 border-t-2 border-l-2 rounded-tl-md" style={{ borderColor: 'var(--accent)' }} />
                    <div className="absolute top-2 right-[calc(50%-130px)] w-5 h-5 border-t-2 border-r-2 rounded-tr-md" style={{ borderColor: 'var(--accent)' }} />
                    <div className="absolute bottom-2 left-[calc(50%-130px)] w-5 h-5 border-b-2 border-l-2 rounded-bl-md" style={{ borderColor: 'var(--accent)' }} />
                    <div className="absolute bottom-2 right-[calc(50%-130px)] w-5 h-5 border-b-2 border-r-2 rounded-br-md" style={{ borderColor: 'var(--accent)' }} />
                </div>

                {/* Instructions */}
                <div className="flex items-center justify-center gap-2 mb-4 p-2.5 rounded-lg"
                    style={{ background: 'var(--bg-input)' }}>
                    <Smartphone className="w-4 h-4" weight="fill" style={{ color: 'var(--text-muted)' }} />
                    <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                        Open camera app → Scan QR → Login on your device
                    </p>
                </div>

                <p className="text-[9px] mb-4" style={{ color: 'var(--text-muted)' }}>
                    URL: {loginUrl}
                </p>

                {/* Back */}
                <Link href="/login">
                    <motion.button whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-1.5 mx-auto px-4 py-2 rounded-lg text-xs font-medium"
                        style={{ color: 'var(--text-secondary)', background: 'var(--bg-input)' }}>
                        <ArrowLeft className="w-3.5 h-3.5" weight="bold" /> Back to Login
                    </motion.button>
                </Link>
            </motion.div>
        </div>
    );
}
