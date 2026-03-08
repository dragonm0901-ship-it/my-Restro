'use client';

import { motion } from 'framer-motion';
import { Star, Quotes } from '@phosphor-icons/react';

const testimonials = [
    {
        name: "Suresh Thapa",
        role: "Owner, The Himalayan Villa",
        content: "myRestro completely transformed how we handle peak hours. The KDS keeps the kitchen calm, and our table turnover has never been faster.",
        rating: 5,
        image: "https://i.pravatar.cc/150?u=suresh",
    },
    {
        name: "Anita Gurung",
        role: "Head Chef, Kathmandu Delights",
        content: "I used to lose my voice shouting orders over the noise. Now, everything appears instantly on the display. It's a lifesaver.",
        rating: 5,
        image: "https://i.pravatar.cc/150?u=anita",
    },
    {
        name: "Rajesh Shrestha",
        role: "Manager, Everest Coffee House",
        content: "The QR code ordering is so intuitive that even our older customers use it without asking for help. Our average order value actually went up!",
        rating: 5,
        image: "https://i.pravatar.cc/150?u=rajesh",
    },
    {
        name: "Priya Lama",
        role: "Operations Director, Bento Box Co.",
        content: "We run 3 different locations. Being able to see real-time analytics for all of them from my phone is incredible.",
        rating: 4,
        image: "https://i.pravatar.cc/150?u=priya",
    },
    {
        name: "Bikash Maharjan",
        role: "Floor Supervisor, Lakeside Grill",
        content: "No more lost paper tickets or arguments about who ordered what. The digital trail is perfect, and the UI is genuinely beautiful to use.",
        rating: 5,
        image: "https://i.pravatar.cc/150?u=bikash",
    },
    {
        name: "Nima Sherpa",
        role: "Founder, Yeti's Den",
        content: "I was skeptical about SaaS pricing at first, but this software pays for itself in just a few days of saved labor and eliminated mistakes.",
        rating: 5,
        image: "https://i.pravatar.cc/150?u=nima",
    }
];

export default function Testimonials() {
    return (
        <section id="testimonials" className="py-24 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black font-['Outfit'] mb-6 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                        Loved by Restaurant Teams
                    </h2>
                    <p className="text-lg max-w-2xl mx-auto font-['Inter']" style={{ color: 'var(--text-secondary)' }}>
                        Don&apos;t just take our word for it. Here is what owners, chefs, and managers are saying about their experience with myRestro.
                    </p>
                </div>

                {/* Masonry Grid */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {testimonials.map((t, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="testimonial-card break-inside-avoid relative group"
                        >
                            <Quotes className="w-10 h-10 absolute top-6 right-6 opacity-10" weight="fill" style={{ color: 'var(--text-muted)' }} />
                            
                            <div className="flex gap-1 mb-6">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-yellow-500" weight="fill" />
                                ))}
                            </div>
                            
                            <p className="text-base leading-relaxed mb-8 font-['Inter']" style={{ color: 'var(--text-secondary)' }}>
                                &ldquo;{t.content}&rdquo;
                            </p>
                            
                            <div className="flex items-center gap-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" style={{ border: '2px solid var(--border)' }} />
                                <div>
                                    <h4 className="font-bold text-sm tracking-wide" style={{ color: 'var(--text-primary)' }}>{t.name}</h4>
                                    <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
