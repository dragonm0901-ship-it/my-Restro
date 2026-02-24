'use client';

import gsap from 'gsap';

export function animateAddToCart(
    sourceEl: HTMLElement | null,
    targetEl: HTMLElement | null
) {
    if (!sourceEl || !targetEl) return;

    const sourceRect = sourceEl.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    const clone = sourceEl.cloneNode(true) as HTMLElement;
    clone.style.position = 'fixed';
    clone.style.top = `${sourceRect.top}px`;
    clone.style.left = `${sourceRect.left}px`;
    clone.style.width = `${sourceRect.width}px`;
    clone.style.height = `${sourceRect.height}px`;
    clone.style.zIndex = '9999';
    clone.style.pointerEvents = 'none';
    clone.style.borderRadius = '50%';
    clone.style.overflow = 'hidden';

    document.body.appendChild(clone);

    gsap.to(clone, {
        duration: 0.6,
        x: targetRect.left - sourceRect.left + targetRect.width / 2 - sourceRect.width / 2,
        y: targetRect.top - sourceRect.top + targetRect.height / 2 - sourceRect.height / 2,
        scale: 0.2,
        opacity: 0,
        ease: 'power3.in',
        onComplete: () => {
            clone.remove();
            // Pulse the cart icon
            gsap.fromTo(
                targetEl,
                { scale: 1 },
                { scale: 1.3, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' }
            );
        },
    });
}

export function staggerFadeIn(selector: string, container?: HTMLElement) {
    const elements = (container || document).querySelectorAll(selector);
    gsap.fromTo(
        elements,
        { opacity: 0, y: 30 },
        {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
        }
    );
}
