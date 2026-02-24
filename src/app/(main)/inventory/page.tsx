'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Package as Package, MagnifyingGlass as Search, Plus as Plus, Warning as AlertTriangle,
    TrendDown as TrendingDown, ArrowDown as ArrowDown, ArrowUp as ArrowUp,
} from '@phosphor-icons/react';

import { useInventoryStore, StockItem } from '@/stores/useInventoryStore';
import toast from 'react-hot-toast';

export default function InventoryPage() {
    const { items: stockData, addItem, updateItem, removeItem } = useInventoryStore();
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<StockItem | null>(null);

    const filteredItems = stockData.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.category.toLowerCase().includes(search.toLowerCase())
    );

    const lowStockCount = stockData.filter((i) => i.currentStock <= i.minStock).length;
    const totalValue = stockData.reduce((s, i) => s + i.currentStock * i.costPerUnit, 0);

    const handleOpenAdd = () => {
        setEditingItem(null);
        setShowModal(true);
    };

    const handleOpenEdit = (item: StockItem) => {
        setEditingItem(item);
        setShowModal(true);
    };

    const handleDelete = (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            removeItem(id);
            toast.success(`${name} deleted`);
        }
    };

    return (
        <div className="space-y-6 page-enter pb-8">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Inventory</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{stockData.length} items tracked across all categories.</p>
                </div>
                <button onClick={handleOpenAdd}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-transform active:scale-95"
                    style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
                    <Plus className="w-4 h-4" weight="bold" /> Add Item
                </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="rounded-3xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
                    <Package className="w-6 h-6 mb-3" weight="fill" style={{ color: 'var(--text-primary)' }} />
                    <p className="text-2xl font-bold tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>{stockData.length}</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Total Items</p>
                </div>
                <div className="rounded-3xl p-6" style={{ background: 'var(--bg-card)', border: lowStockCount > 0 ? '1px solid rgba(231,76,60,0.3)' : '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
                    <AlertTriangle className="w-6 h-6 mb-3" weight="fill" style={{ color: lowStockCount > 0 ? 'var(--danger)' : 'var(--text-primary)' }} />
                    <p className="text-2xl font-bold tracking-tight mb-1" style={{ color: lowStockCount > 0 ? 'var(--danger)' : 'var(--text-primary)' }}>{lowStockCount}</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Low Stock</p>
                </div>
                <div className="rounded-3xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
                    <TrendingDown className="w-6 h-6 mb-3" weight="bold" style={{ color: 'var(--info)' }} />
                    <p className="text-2xl font-bold tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>Rs. {(totalValue / 1000).toFixed(1)}k</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Stock Value</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" weight="bold" style={{ color: 'var(--text-muted)' }} />
                <input type="text" placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-1 transition-all"
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            </div>

            {/* Stock Table */}
            <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="grid grid-cols-12 px-4 py-2 text-[9px] font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                    <span className="col-span-3">Item</span>
                    <span className="col-span-2">Category</span>
                    <span className="col-span-2 text-center">Stock</span>
                    <span className="col-span-1 text-center">Min</span>
                    <span className="col-span-2 text-right">Cost/Unit</span>
                    <span className="col-span-2 text-right">Status</span>
                </div>
                {filteredItems.map((item, i) => {
                    const isLow = item.currentStock <= item.minStock;
                    return (
                        <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                            className="grid grid-cols-12 px-4 py-2.5 items-center row-hover"
                            style={{ borderBottom: i < filteredItems.length - 1 ? '1px solid var(--border)' : 'none', background: isLow ? 'rgba(231,76,60,0.03)' : 'transparent' }}>
                            <div className="col-span-3 flex items-center gap-2">
                                <span className="text-[11px] font-bold" style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                            </div>
                            <span className="col-span-2 text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider w-fit"
                                style={{
                                    background: 'var(--bg-elevated)',
                                    borderColor: 'var(--border)',
                                    color: 'var(--text-primary)',
                                }}>{item.category}</span>
                            <span className="col-span-2 text-center text-[11px] font-bold" style={{ color: isLow ? 'var(--danger)' : 'var(--text-primary)' }}>
                                {item.currentStock} {item.unit}
                            </span>
                            <span className="col-span-1 text-center text-[10px]" style={{ color: 'var(--text-muted)' }}>{item.minStock}</span>
                            <span className="col-span-2 text-right text-[11px]" style={{ color: 'var(--text-secondary)' }}>Rs. {item.costPerUnit}</span>
                            <div className="col-span-2 flex justify-end items-center gap-2">
                                {isLow ? (
                                    <span className="flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded"
                                        style={{ background: 'rgba(231,76,60,0.1)', color: 'var(--danger)' }}>
                                        <ArrowDown className="w-2.5 h-2.5" weight="bold" /> Low
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded"
                                        style={{ background: 'rgba(46,204,113,0.1)', color: 'var(--success)' }}>
                                        <ArrowUp className="w-2.5 h-2.5" weight="bold" /> OK
                                    </span>
                                )}
                                <div className="flex items-center gap-1.5 ml-3 pl-3 border-l" style={{ borderColor: 'var(--border)' }}>
                                    <button onClick={() => handleOpenEdit(item)} className="p-1.5 rounded hover:bg-black/5" style={{ color: 'var(--text-secondary)' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                                    </button>
                                    <button onClick={() => handleDelete(item.id, item.name)} className="p-1.5 rounded hover:bg-red-500/10" style={{ color: 'var(--danger)' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <InventoryModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                editingItem={editingItem}
                onSave={(data) => {
                    if (editingItem) {
                        updateItem(editingItem.id, data);
                        toast.success('Item updated');
                    } else {
                        addItem(data as Omit<StockItem, 'id' | 'lastRestocked'>);
                        toast.success('Item added');
                    }
                    setShowModal(false);
                }}
            />
        </div>
    );
}

// Sub-component for Modal
function InventoryModal({
    isOpen,
    onClose,
    editingItem,
    onSave
}: {
    isOpen: boolean,
    onClose: () => void,
    editingItem: StockItem | null,
    onSave: (data: Partial<StockItem>) => void
}) {
    const [formData, setFormData] = useState({
        name: '', category: 'Vegetables', unit: 'kg',
        currentStock: '', minStock: '', costPerUnit: ''
    });

    // Populate data on mount or edit change
    useState(() => {
        if (editingItem) {
            setFormData({
                name: editingItem.name,
                category: editingItem.category,
                unit: editingItem.unit,
                currentStock: String(editingItem.currentStock),
                minStock: String(editingItem.minStock),
                costPerUnit: String(editingItem.costPerUnit),
            });
        }
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            name: formData.name,
            category: formData.category,
            unit: formData.unit,
            currentStock: Number(formData.currentStock),
            minStock: Number(formData.minStock),
            costPerUnit: Number(formData.costPerUnit)
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-sm rounded-xl p-5 shadow-2xl"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
                <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    {editingItem ? 'Edit Item' : 'Add New Item'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="text-[10px] font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>Name</label>
                        <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1"
                            style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>Category</label>
                            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none"
                                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                                <option value="Vegetables">Vegetables</option>
                                <option value="Meat">Meat</option>
                                <option value="Groceries">Groceries</option>
                                <option value="Spices">Spices</option>
                                <option value="Dairy">Dairy</option>
                                <option value="Oil">Oil</option>
                                <option value="Grains">Grains</option>
                                <option value="Beverages">Beverages</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>Unit</label>
                            <select value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none"
                                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                                <option value="kg">kg</option>
                                <option value="ltr">ltr</option>
                                <option value="pcs">pcs</option>
                                <option value="box">box</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>Current Stock</label>
                            <input required type="number" min="0" step="0.5" value={formData.currentStock} onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                                className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1"
                                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                        </div>
                        <div>
                            <label className="text-[10px] font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>Min Stock Alert</label>
                            <input required type="number" min="0" step="0.5" value={formData.minStock} onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                                className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1"
                                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>Cost Per Unit (Rs.)</label>
                        <input required type="number" min="0" value={formData.costPerUnit} onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
                            className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1"
                            style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-2 rounded-lg text-xs font-semibold"
                            style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>Cancel</button>
                        <button type="submit"
                            className="flex-1 py-2 rounded-lg text-xs font-semibold"
                            style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}>Save Item</button>
                    </div>
                </form>
            </motion.div>
        </div >
    );
}
