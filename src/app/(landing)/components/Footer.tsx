'use client';

import Link from 'next/link';
import { LogoIcon } from '@/components/Logo';

const footerLinks = {
    Product: [
        { label: 'Features', href: '/#features' },
        { label: 'Pricing', href: '/#pricing' },
        { label: 'Gallery', href: '/#gallery' },
        { label: 'Integrations', href: '/integrations' },
    ],
    Company: [
        { label: 'About Us', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
    ],
    Support: [
        { label: 'Help Center', href: '/help' },
        { label: 'Documentation', href: '/docs' },
        { label: 'API Reference', href: '/api-reference' },
        { label: 'Status', href: '/status' },
    ],
    Legal: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
    ],
};

export default function Footer() {
    return (
        <footer style={{
            padding: '80px 24px 40px',
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border)',
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                {/* Top Section */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: '48px',
                    marginBottom: '64px',
                }}>
                    {/* Brand Column */}
                    <div style={{ gridColumn: 'span 1' }}>
                        <Link href="/" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            textDecoration: 'none',
                            marginBottom: '16px',
                        }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'var(--text-primary)',
                            }}>
                                <LogoIcon size={18} style={{ color: 'var(--bg-primary)' }} />
                            </div>
                            <span style={{
                                fontFamily: "'Outfit', sans-serif",
                                fontWeight: 700,
                                fontSize: '18px',
                                color: 'var(--text-primary)',
                            }}>
                                myRestro
                            </span>
                        </Link>
                        <p style={{
                            fontSize: '13px',
                            lineHeight: 1.6,
                            color: 'var(--text-muted)',
                            maxWidth: '240px',
                            fontFamily: "'Inter', sans-serif",
                        }}>
                            The all-in-one digital platform for modern restaurant management.
                        </p>
                    </div>

                    {/* Link Columns */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 700,
                                fontSize: '13px',
                                color: 'var(--text-primary)',
                                marginBottom: '16px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}>
                                {category}
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {links.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className="footer-link"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    paddingTop: '24px',
                    borderTop: '1px solid #E4E4E7',
                }}>
                    <p style={{
                        fontSize: '13px',
                        color: '#A1A1AA',
                        fontFamily: "'Inter', sans-serif",
                    }}>
                        © {new Date().getFullYear()} myRestro. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ fontSize: '13px' }}>Twitter</a>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ fontSize: '13px' }}>LinkedIn</a>
                        <a href="https://github.com/luishidalgoa/myRestro" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ fontSize: '13px' }}>GitHub</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
