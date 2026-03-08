'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogoIcon } from '@/components/Logo';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const navLinks = [
        { label: 'Features', href: '/#features' },
        { label: 'How it Works', href: '/#how-it-works' },
        { label: 'Gallery', href: '/#gallery' },
        { label: 'Pricing', href: '/#pricing' },
    ];

    return (
        <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
            <div style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '0 24px',
                height: '72px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                {/* Logo */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#09090B',
                    }}>
                        <LogoIcon size={22} style={{ color: '#FFFFFF' }} />
                    </div>
                    <span style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 700,
                        fontSize: '20px',
                        color: '#09090B',
                        letterSpacing: '-0.02em',
                    }}>
                        myRestro
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="nav-desktop-links">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            style={{
                                color: '#52525B',
                                fontSize: '14px',
                                fontWeight: 500,
                                textDecoration: 'none',
                                transition: 'color 0.2s ease',
                                fontFamily: "'Inter', sans-serif",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#09090B')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#52525B')}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* CTA Buttons */}
                <div className="nav-desktop-cta">
                    <Link
                        href="/login"
                        style={{
                            color: '#52525B',
                            fontSize: '14px',
                            fontWeight: 600,
                            textDecoration: 'none',
                            padding: '10px 20px',
                            borderRadius: '10px',
                            transition: 'all 0.2s ease',
                            fontFamily: "'Inter', sans-serif",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#F4F4F5';
                            e.currentTarget.style.color = '#09090B';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#52525B';
                        }}
                    >
                        Request Demo
                    </Link>
                    <Link
                        href="/login"
                        style={{
                            background: '#09090B',
                            color: '#FFFFFF',
                            fontSize: '14px',
                            fontWeight: 600,
                            textDecoration: 'none',
                            padding: '10px 24px',
                            borderRadius: '10px',
                            transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                            fontFamily: "'Inter', sans-serif",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#27272A';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(9,9,11,0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#09090B';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        Sign Up Free
                    </Link>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="nav-mobile-toggle"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px',
                        flexDirection: 'column',
                        gap: '5px',
                    }}
                    aria-label="Toggle menu"
                >
                    <span style={{
                        display: 'block',
                        width: '22px',
                        height: '2px',
                        background: '#09090B',
                        borderRadius: '2px',
                        transition: 'all 0.3s ease',
                        transform: mobileOpen ? 'rotate(45deg) translateY(7px)' : 'none',
                    }} />
                    <span style={{
                        display: 'block',
                        width: '22px',
                        height: '2px',
                        background: '#09090B',
                        borderRadius: '2px',
                        transition: 'all 0.3s ease',
                        opacity: mobileOpen ? 0 : 1,
                    }} />
                    <span style={{
                        display: 'block',
                        width: '22px',
                        height: '2px',
                        background: '#09090B',
                        borderRadius: '2px',
                        transition: 'all 0.3s ease',
                        transform: mobileOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
                    }} />
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className="nav-mobile-menu"
                style={{
                    maxHeight: mobileOpen ? '400px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(16px)',
                    borderBottom: mobileOpen ? '1px solid #E4E4E7' : 'none',
                }}
            >
                <div style={{ padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            style={{
                                color: '#09090B',
                                fontSize: '16px',
                                fontWeight: 500,
                                textDecoration: 'none',
                                padding: '12px 0',
                                borderBottom: '1px solid #F4F4F5',
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                        <Link
                            href="/login"
                            onClick={() => setMobileOpen(false)}
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                padding: '12px',
                                borderRadius: '10px',
                                border: '1px solid #E4E4E7',
                                color: '#09090B',
                                fontWeight: 600,
                                fontSize: '14px',
                                textDecoration: 'none',
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            Demo
                        </Link>
                        <Link
                            href="/login"
                            onClick={() => setMobileOpen(false)}
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                padding: '12px',
                                borderRadius: '10px',
                                background: '#09090B',
                                color: '#FFFFFF',
                                fontWeight: 600,
                                fontSize: '14px',
                                textDecoration: 'none',
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
