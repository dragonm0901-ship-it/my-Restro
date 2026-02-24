'use client';

interface CategoryPillsProps {
    categories: { id: string; label: string }[];
    activeCategory: string;
    onSelect: (id: string) => void;
}

export default function CategoryPills({ categories, activeCategory, onSelect }: CategoryPillsProps) {
    return (
        <div className="flex gap-1 overflow-x-auto hide-scrollbar pb-1">
            {categories.map((cat) => {
                const isActive = cat.id === activeCategory;
                return (
                    <button key={cat.id} onClick={() => onSelect(cat.id)}
                        className="px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all duration-150"
                        style={{
                            background: isActive ? 'var(--accent)' : 'var(--bg-input)',
                            color: isActive ? 'var(--accent-fg)' : 'var(--text-secondary)',
                            border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                        }}>{cat.label}</button>
                );
            })}
        </div>
    );
}
