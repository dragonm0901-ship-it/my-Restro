'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogoIcon } from '@/components/Logo';
import { Sun, Moon } from '@phosphor-icons/react';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const toggleTheme = () => {
        const root = document.querySelector('.landing-root');
        if (!root) return;
        const newTheme = isDark ? 'light' : 'dark';
        root.setAttribute('data-theme', newTheme);
        setIsDark(!isDark);
    };

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
                        background: 'var(--accent)',
                    }}>
                        <LogoIcon size={22} style={{ color: 'var(--accent-fg)' }} />
                    </div>
                    <span style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 700,
                        fontSize: '20px',
                        color: 'var(--text-primary)',
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
                                color: 'var(--text-secondary)',
                                fontSize: '14px',
                                fontWeight: 500,
                                textDecoration: 'none',
                                transition: 'color 0.2s ease',
                                fontFamily: "'Inter', sans-serif",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* CTA Buttons + Theme Toggle */}
                <div className="nav-desktop-cta">
                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle dark mode"
                        style={{
                            position: 'relative',
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: 'var(--bg-elevated)',
                            border: '1px solid var(--border)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1) rotate(15deg)';
                            e.currentTarget.style.borderColor = 'var(--border-hover)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                            e.currentTarget.style.borderColor = 'var(--border)';
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            transform: isDark ? 'translateY(-40px) rotate(-90deg) scale(0)' : 'translateY(0) rotate(0deg) scale(1)',
                            opacity: isDark ? 0 : 1,
                        }}>
                            <Moon size={18} weight="bold" style={{ color: 'var(--text-primary)' }} />
                        </div>
                        <div style={{
                            position: 'absolute',
                            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            transform: isDark ? 'translateY(0) rotate(0deg) scale(1)' : 'translateY(40px) rotate(90deg) scale(0)',
                            opacity: isDark ? 1 : 0,
                        }}>
                            <Sun size={18} weight="bold" style={{ color: 'var(--text-primary)' }} />
                        </div>
                    </button>

                    <Link
                        href="/login"
                        style={{
                            color: 'var(--text-secondary)',
                            fontSize: '14px',
                            fontWeight: 600,
                            textDecoration: 'none',
                            padding: '10px 20px',
                            borderRadius: '10px',
                            transition: 'all 0.2s ease',
                            fontFamily: "'Inter', sans-serif",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--bg-elevated)';
                            e.currentTarget.style.color = 'var(--text-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                    >
                        Request Demo
                    </Link>
                    <Link
                        href="/login"
                        className="btn-primary"
                        style={{
                            fontSize: '14px',
                            padding: '10px 24px',
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
                    {[0, 1, 2].map((i) => (
                        <span key={i} style={{
                            display: 'block',
                            width: '22px',
                            height: '2px',
                            background: 'var(--text-primary)',
                            borderRadius: '2px',
                            transition: 'all 0.3s ease',
                            transform: i === 0 && mobileOpen ? 'rotate(45deg) translateY(7px)' : i === 2 && mobileOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
                            opacity: i === 1 && mobileOpen ? 0 : 1,
                        }} />
                    ))}
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className="nav-mobile-menu"
                style={{
                    maxHeight: mobileOpen ? '400px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                    background: 'color-mix(in srgb, var(--bg-primary) 95%, transparent)',
                    backdropFilter: 'blur(16px)',
                    borderBottom: mobileOpen ? '1px solid var(--border)' : 'none',
                }}
            >
                <div style={{ padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            style={{
                                color: 'var(--text-primary)',
                                fontSize: '16px',
                                fontWeight: 500,
                                textDecoration: 'none',
                                padding: '12px 0',
                                borderBottom: '1px solid var(--border)',
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px', alignItems: 'center' }}>
                        {/* Mobile theme toggle */}
                        <button onClick={toggleTheme} style={{
                            width: '44px', height: '44px', borderRadius: '10px',
                            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            {isDark ? <Sun size={18} weight="bold" style={{ color: 'var(--text-primary)' }} /> : <Moon size={18} weight="bold" style={{ color: 'var(--text-primary)' }} />}
                        </button>
                        <Link
                            href="/login"
                            onClick={() => setMobileOpen(false)}
                            style={{
                                flex: 1, textAlign: 'center', padding: '12px',
                                borderRadius: '10px', border: '1px solid var(--border)',
                                color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px',
                                textDecoration: 'none', fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            Demo
                        </Link>
                        <Link
                            href="/login"
                            onClick={() => setMobileOpen(false)}
                            className="btn-primary"
                            style={{
                                flex: 1, textAlign: 'center', padding: '12px',
                                borderRadius: '10px', fontSize: '14px',
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
