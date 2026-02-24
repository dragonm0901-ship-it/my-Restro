'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserPlus as UserPlus, MagnifyingGlass as Search, X as X, Phone as Phone,
    Clock as Clock, Calendar as Calendar, CaretRight as ChevronRight,
    CheckCircle as CheckCircle2, XCircle as XCircle, EnvelopeSimple as Mail,
    MapPin as MapPin, Trash as Trash2, Bell as Bell,
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { useNotificationStore } from '@/stores/useNotificationStore';

interface StaffMember {
    id: string;
    name: string;
    role: string;
    phone: string;
    email: string;
    address: string;
    status: 'on_duty' | 'off_day' | 'on_leave';
    shift: string;
    joinDate: string;
    salary: number;
    avatar?: string;
}

const initialStaff: StaffMember[] = [
    { id: 'S1', name: 'Ram Sharma', role: 'Head Chef', phone: '9841000001', email: 'ram@rms.com', address: 'Balkhu, Kathmandu', status: 'on_duty', shift: '6:00 AM – 3:00 PM', joinDate: '2024-03-15', salary: 35000 },
    { id: 'S2', name: 'Sita Gurung', role: 'Waiter', phone: '9841000002', email: 'sita@rms.com', address: 'Kalimati, Kathmandu', status: 'on_duty', shift: '10:00 AM – 7:00 PM', joinDate: '2024-06-01', salary: 18000 },
    { id: 'S3', name: 'Bikash Thapa', role: 'Waiter', phone: '9841000003', email: 'bikash@rms.com', address: 'Baneshwor, Kathmandu', status: 'on_duty', shift: '2:00 PM – 11:00 PM', joinDate: '2024-08-20', salary: 18000 },
    { id: 'S4', name: 'Anita Rai', role: 'Cashier', phone: '9841000004', email: 'anita@rms.com', address: 'Patan, Lalitpur', status: 'off_day', shift: '—', joinDate: '2024-04-10', salary: 22000 },
    { id: 'S5', name: 'Prakash KC', role: 'Sous Chef', phone: '9841000005', email: 'prakash@rms.com', address: 'Thamel, Kathmandu', status: 'on_duty', shift: '6:00 AM – 3:00 PM', joinDate: '2024-05-01', salary: 28000 },
    { id: 'S6', name: 'Maya Tamang', role: 'Manager', phone: '9841000006', email: 'maya@rms.com', address: 'Naxal, Kathmandu', status: 'on_duty', shift: '9:00 AM – 6:00 PM', joinDate: '2023-11-01', salary: 45000 },
    { id: 'S7', name: 'Dipak Bhandari', role: 'Cleaner', phone: '9841000007', email: 'dipak@rms.com', address: 'Jorpati, Kathmandu', status: 'on_leave', shift: '—', joinDate: '2025-01-15', salary: 15000 },
];

const roleColors: Record<string, string> = {
    'Head Chef': 'var(--warning)',
    'Sous Chef': '#f97316',
    Waiter: 'var(--info)',
    Cashier: 'var(--success)',
    Manager: '#a855f7',
    Cleaner: 'var(--text-muted)',
};

const statusConfig = {
    on_duty: { label: 'On Duty', color: 'var(--success)', bg: 'rgba(46,204,113,0.08)' },
    off_day: { label: 'Off Day', color: 'var(--text-muted)', bg: 'var(--bg-input)' },
    on_leave: { label: 'On Leave', color: 'var(--warning)', bg: 'rgba(232,168,56,0.08)' },
};

export default function StaffPage() {
    const [staff, setStaff] = useState(initialStaff);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newStaff, setNewStaff] = useState({ name: '', role: 'Waiter', phone: '', email: '', address: '', salary: '' });
    const addNotification = useNotificationStore((s) => s.addNotification);

    const filtered = staff.filter((s) => {
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const onDutyCount = staff.filter((s) => s.status === 'on_duty').length;

    const handleAddStaff = () => {
        if (!newStaff.name || !newStaff.phone) { toast.error('Name and phone are required'); return; }
        const member: StaffMember = {
            id: `S${Date.now()}`, name: newStaff.name, role: newStaff.role, phone: newStaff.phone,
            email: newStaff.email || `${newStaff.name.toLowerCase().replace(/\s/g, '')}@rms.com`,
            address: newStaff.address || 'Kathmandu', status: 'off_day', shift: '—',
            joinDate: new Date().toISOString().slice(0, 10), salary: Number(newStaff.salary) || 18000,
        };
        setStaff((prev) => [...prev, member]);
        setShowAddModal(false);
        setNewStaff({ name: '', role: 'Waiter', phone: '', email: '', address: '', salary: '' });
        toast.success(`${member.name} added to staff`);
    };

    const toggleStatus = (id: string) => {
        setStaff((prev) => prev.map((s) => {
            if (s.id !== id) return s;
            const next = s.status === 'on_duty' ? 'off_day' : 'on_duty';
            return { ...s, status: next, shift: next === 'on_duty' ? '9:00 AM – 6:00 PM' : '—' };
        }));
        toast.success('Status updated');
    };

    const handleAlertStaff = (member: StaffMember) => {
        // Simulating sending a web socket notification
        addNotification({
            message: `Alert sent to ${member.name} (${member.role}): Please return to your station immediately.`,
            type: 'info',
            forRole: 'owner', // In reality, this would just be for the staff id logic
        });
        toast.success(`Alert notification dispatched to ${member.name}`);
    };

    const handleRemoveStaff = (member: StaffMember) => {
        if (confirm(`Are you absolutely sure you want to remove ${member.name}?`)) {
            setStaff((prev) => prev.filter(s => s.id !== member.id));
            setSelectedStaff(null);
            toast.success(`${member.name} has been removed from staff list`);
        }
    };

    return (
        <div className="space-y-6 page-enter pb-8">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Staff</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Manage your {staff.length} team members · {onDutyCount} currently on duty.</p>
                </div>
                <button onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-transform active:scale-95"
                    style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
                    <UserPlus className="w-4 h-4" weight="bold" /> Add Staff
                </button>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-2 flex-wrap">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" weight="bold" style={{ color: 'var(--text-muted)' }} />
                    <input type="text" placeholder="Search by name or role..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-1 transition-all"
                        style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent)' } as React.CSSProperties} />
                </div>
                {['all', 'on_duty', 'off_day', 'on_leave'].map((f) => (
                    <button key={f} onClick={() => setFilterStatus(f)}
                        className="px-2.5 py-1.5 rounded-lg text-[10px] font-medium capitalize"
                        style={{
                            background: filterStatus === f ? 'var(--accent)' : 'var(--bg-input)',
                            color: filterStatus === f ? 'var(--accent-fg)' : 'var(--text-secondary)',
                            border: `1px solid ${filterStatus === f ? 'var(--accent)' : 'var(--border)'}`,
                        }}>{f === 'all' ? 'All' : statusConfig[f as keyof typeof statusConfig]?.label}</button>
                ))}
            </div>

            {/* Staff List */}
            <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                {filtered.map((s, i) => {
                    const sc = statusConfig[s.status];
                    const rc = roleColors[s.role] || 'var(--accent)';
                    return (
                        <motion.div key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                            className="flex items-center gap-3 px-4 py-3 cursor-pointer row-hover"
                            onClick={() => setSelectedStaff(s)}
                            style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                                style={{ background: rc, color: rc === 'var(--accent)' ? 'var(--accent-fg)' : '#fff' }}>{s.name.split(' ').map((n) => n[0]).join('')}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[12px] font-semibold" style={{ color: 'var(--text-primary)' }}>{s.name}</span>
                                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded"
                                        style={{ background: `color-mix(in srgb, ${rc} 10%, transparent)`, color: rc }}>{s.role}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-0.5 text-[9px]" style={{ color: 'var(--text-muted)' }}>
                                    <span className="flex items-center gap-0.5"><Phone className="w-2.5 h-2.5" weight="fill" /> {s.phone}</span>
                                    {s.status === 'on_duty' && <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" weight="bold" /> {s.shift}</span>}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full"
                                    style={{ background: sc.bg, color: sc.color }}>
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.color }} />
                                    {sc.label}
                                </span>
                                <ChevronRight className="w-3.5 h-3.5" weight="bold" style={{ color: 'var(--text-muted)' }} />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Detail Drawer */}
            <AnimatePresence>
                {selectedStaff && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedStaff(null)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
                        <motion.div
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                            className="fixed right-0 top-0 bottom-0 w-[340px] z-50 overflow-y-auto"
                            style={{ background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)' }}>
                            <div className="p-5 space-y-5">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Staff Details</h2>
                                    <button onClick={() => setSelectedStaff(null)} className="p-1 rounded" style={{ color: 'var(--text-muted)' }}><X className="w-4 h-4" weight="bold" /></button>
                                </div>
                                {/* Profile */}
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
                                        style={{ background: roleColors[selectedStaff.role] || 'var(--accent)', color: !roleColors[selectedStaff.role] ? 'var(--accent-fg)' : '#fff' }}>
                                        {selectedStaff.name.split(' ').map((n) => n[0]).join('')}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{selectedStaff.name}</p>
                                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                                            style={{ background: `color-mix(in srgb, ${roleColors[selectedStaff.role] || 'var(--accent)'} 10%, transparent)`, color: roleColors[selectedStaff.role] || 'var(--accent)' }}>{selectedStaff.role}</span>
                                    </div>
                                </div>
                                {/* Status toggle */}
                                <div className="rounded-lg p-3" style={{ background: statusConfig[selectedStaff.status].bg, border: '1px solid var(--border)' }}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {selectedStaff.status === 'on_duty' ? <CheckCircle2 className="w-4 h-4" weight="fill" style={{ color: 'var(--success)' }} /> : <XCircle className="w-4 h-4" weight="bold" style={{ color: 'var(--text-muted)' }} />}
                                            <span className="text-[11px] font-semibold" style={{ color: statusConfig[selectedStaff.status].color }}>{statusConfig[selectedStaff.status].label}</span>
                                        </div>
                                        <button onClick={() => {
                                            toggleStatus(selectedStaff.id);
                                            const next = selectedStaff.status === 'on_duty' ? 'off_day' : 'on_duty';
                                            setSelectedStaff({ ...selectedStaff, status: next, shift: next === 'on_duty' ? '9:00 AM – 6:00 PM' : '—' });
                                        }}
                                            className="text-[10px] font-medium px-2.5 py-1 rounded-md text-white"
                                            style={{ background: selectedStaff.status === 'on_duty' ? 'var(--text-muted)' : 'var(--success)' }}>
                                            {selectedStaff.status === 'on_duty' ? 'Clock Out' : 'Clock In'}
                                        </button>
                                    </div>
                                    {selectedStaff.status === 'on_duty' && (
                                        <p className="text-[10px] mt-1.5 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                                            <Clock className="w-3 h-3" weight="bold" /> {selectedStaff.shift}
                                        </p>
                                    )}
                                </div>
                                {/* Info */}
                                <div className="space-y-2.5">
                                    {[
                                        { icon: Phone, label: 'Phone', value: selectedStaff.phone },
                                        { icon: Mail, label: 'Email', value: selectedStaff.email },
                                        { icon: MapPin, label: 'Address', value: selectedStaff.address },
                                        { icon: Calendar, label: 'Joined', value: new Date(selectedStaff.joinDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
                                    ].map(({ icon: Icon, label, value }) => (
                                        <div key={label} className="flex items-center gap-2.5 text-[11px]">
                                            <Icon className="w-3.5 h-3.5 shrink-0" weight="fill" style={{ color: 'var(--text-muted)' }} />
                                            <div>
                                                <p className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</p>
                                                <p style={{ color: 'var(--text-primary)' }}>{value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Salary */}
                                <div className="rounded-lg p-3" style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}>
                                    <p className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Monthly Salary</p>
                                    <p className="text-base font-bold" style={{ color: 'var(--accent-text)' }}>Rs. {selectedStaff.salary.toLocaleString()}</p>
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                                    <button onClick={() => handleAlertStaff(selectedStaff)}
                                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
                                        style={{ background: 'rgba(232, 168, 56, 0.1)', color: 'var(--warning)' }}>
                                        <Bell className="w-3.5 h-3.5" weight="fill" /> Alert Worker
                                    </button>
                                    <button onClick={() => handleRemoveStaff(selectedStaff)}
                                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
                                        style={{ background: 'rgba(231, 76, 60, 0.1)', color: 'var(--danger)' }}>
                                        <Trash2 className="w-3.5 h-3.5" weight="fill" /> Remove
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Add Staff Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] rounded-2xl z-50 p-6"
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Add Staff Member</h3>
                                <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-md hover:bg-black/5" style={{ color: 'var(--text-muted)' }}><X className="w-4 h-4" weight="bold" /></button>
                            </div>

                            <div className="space-y-3 mb-5">
                                {[
                                    { key: 'name', label: 'Full Name', placeholder: 'e.g. Hari Bahadur', type: 'text' },
                                    { key: 'phone', label: 'Phone', placeholder: '9841xxxxxx', type: 'tel' },
                                    { key: 'email', label: 'Email', placeholder: 'hari@rms.com', type: 'email' },
                                    { key: 'address', label: 'Address', placeholder: 'Kathmandu', type: 'text' },
                                    { key: 'salary', label: 'Monthly Salary (Rs.)', placeholder: '18000', type: 'number' },
                                ].map(({ key, label, placeholder, type }) => (
                                    <div key={key}>
                                        <label className="text-[10px] font-semibold uppercase tracking-wider block mb-1 max-w-fit" style={{ color: 'var(--text-muted)' }}>{label}</label>
                                        <input type={type} placeholder={placeholder}
                                            value={(newStaff as Record<string, string>)[key]}
                                            onChange={(e) => setNewStaff({ ...newStaff, [key]: e.target.value })}
                                            className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 transition-all"
                                            style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                                    </div>
                                ))}
                            </div>
                            <div className="mb-5">
                                <label className="text-[10px] font-medium uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>Role</label>
                                <select value={newStaff.role} onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                                    className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none"
                                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                                    {['Waiter', 'Head Chef', 'Sous Chef', 'Cashier', 'Manager', 'Cleaner'].map((r) => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>
                            <button onClick={handleAddStaff}
                                className="w-full py-2.5 rounded-lg text-xs font-semibold shadow-sm hover:opacity-95 transition-opacity active:scale-[0.98]"
                                style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}>Add Member</button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
