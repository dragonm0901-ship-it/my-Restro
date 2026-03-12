'use client';

// Geometric "R" logo matching the myRestro Manager brand identity
// Based on the uploaded isometric wireframe R design
export function LogoIcon({ size = 32, className = '', style }: { size?: number; className?: string; style?: React.CSSProperties }) {
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
            {/* Outer R shape - geometric wireframe */}
            <path d="M25 85V15h30c11 0 20 9 20 20s-9 20-20 20H42l28 30" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Inner geometric detail */}
            <path d="M32 78V22h23c8 0 14 6 14 14s-6 14-14 14H40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
            {/* 3D depth lines */}
            <path d="M30 80V20h26c9.5 0 17 7.5 17 17s-7.5 17-17 17H41l25 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.25" />
        </svg>
    );
}

export function LogoFull({ collapsed = false }: { collapsed?: boolean }) {
    return (
        <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#0a0a0a', border: '1px solid #333333' }}>
                <LogoIcon size={20} style={{ color: 'var(--accent)' }} />
            </div>
            {!collapsed && (
                <span className="text-sm font-bold whitespace-nowrap overflow-hidden font-['Outfit']"
                    style={{ color: 'var(--text-primary)' }}>
                    myRestro Manager
                </span>
            )}
        </div>
    );
}
