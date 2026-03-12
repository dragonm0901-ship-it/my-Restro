'use client';

import { useState } from 'react';

import { Plus, Trash, Armchair, Bed } from '@phosphor-icons/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { localDb } from '@/lib/db/localDb';
import { createClient } from '@/lib/supabase';
import { useRoleStore } from '@/stores/useRoleStore';
import toast from 'react-hot-toast';

export default function FloorplanSettingsPage() {
    const { restaurantId } = useRoleStore();
    
    const tables = useLiveQuery(() => localDb.restaurant_tables.toArray()) || [];
    const rooms = useLiveQuery(() => localDb.hotel_rooms.toArray()) || [];

    const [isSaving, setIsSaving] = useState(false);

    const [newTableNum, setNewTableNum] = useState('');
    const [newTableCap, setNewTableCap] = useState('4');
    const [newRoomNum, setNewRoomNum] = useState('');

    const addTable = async () => {
        if (!newTableNum) {
            toast.error('Please enter a table number');
            return;
        }
        if (!restaurantId) {
            toast.error('No restaurant linked. Please log in again.');
            return;
        }
        setIsSaving(true);
        try {
            const supabase = createClient();
            const { data, error } = await supabase.from('tables').insert({
                restaurant_id: restaurantId,
                table_number: newTableNum,
                capacity: parseInt(newTableCap) || 4
            }).select().single();
            if (error) throw error;

            // Also add to local DB immediately for instant UI feedback
            if (data) {
                await localDb.restaurant_tables.put({
                    id: data.id,
                    table_number: data.table_number,
                    capacity: data.capacity,
                    status: data.status || 'available',
                });
            }

            toast.success(`Table ${newTableNum} added!`);
            setNewTableNum('');
        } catch (err: unknown) {
            console.error('Add table failed:', err);
            toast.error(err instanceof Error ? err.message : 'Failed to add table');
        } finally {
            setIsSaving(false);
        }
    };

    const deleteTable = async (id: string, num: string) => {
        if (!confirm(`Delete Table ${num}?`)) return;
        try {
            const supabase = createClient();
            const { error } = await supabase.from('tables').delete().eq('id', id);
            if (error) throw error;
            await localDb.restaurant_tables.delete(id);
            toast.success('Table deleted');
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : 'Failed to delete table');
        }
    };

    const addRoom = async () => {
        if (!newRoomNum) {
            toast.error('Please enter a room number');
            return;
        }
        if (!restaurantId) {
            toast.error('No restaurant linked. Please log in again.');
            return;
        }
        setIsSaving(true);
        try {
            const supabase = createClient();
            const { data, error } = await supabase.from('hotel_rooms').insert({
                restaurant_id: restaurantId,
                room_number: newRoomNum,
            }).select().single();
            if (error) throw error;

            // Also add to local DB immediately for instant UI feedback
            if (data) {
                await localDb.hotel_rooms.put({
                    id: data.id,
                    room_number: data.room_number,
                    status: data.status || 'available',
                });
            }

            toast.success(`Room ${newRoomNum} added!`);
            setNewRoomNum('');
        } catch (err: unknown) {
            console.error('Add room failed:', err);
            toast.error(err instanceof Error ? err.message : 'Failed to add room');
        } finally {
            setIsSaving(false);
        }
    };

    const deleteRoom = async (id: string, num: string) => {
        if (!confirm(`Delete Room ${num}?`)) return;
        try {
            const supabase = createClient();
            const { error } = await supabase.from('hotel_rooms').delete().eq('id', id);
            if (error) throw error;
            await localDb.hotel_rooms.delete(id);
            toast.success('Room deleted');
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : 'Failed to delete room');
        }
    };

    return (
        <div className="space-y-6 max-w-3xl page-enter pb-16">
            <div>
                <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Floorplan & Rooms</h2>
                <p className="text-[13px] mt-1" style={{ color: 'var(--text-secondary)' }}>Manage your physical restaurant layout and hotel rooms.</p>
            </div>

            {!restaurantId && (
                <div className="rounded-xl p-4 text-sm font-medium" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                    ⚠ No restaurant linked to your account. Tables and rooms cannot be managed until a restaurant is linked.
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Tables Manager */}
                <div className="rounded-3xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
                    <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <Armchair className="w-5 h-5" weight="fill" /> Restaurant Tables
                    </h3>
                    
                    <div className="mt-5 space-y-3">
                        {tables.length === 0 ? (
                            <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>No tables configured.</p>
                        ) : (
                            tables.map(t => (
                                <div key={t.id} className="flex justify-between items-center p-3 rounded-xl border" style={{ borderColor: 'var(--border)', background: 'var(--bg-input)' }}>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Table {t.table_number}</span>
                                        <span className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>Capacity: {t.capacity}</span>
                                    </div>
                                    <button onClick={() => deleteTable(t.id, t.table_number)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-6 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
                        <p className="text-xs font-bold mb-3" style={{ color: 'var(--text-muted)' }}>Add New Table</p>
                        <div className="flex gap-2">
                            <input 
                                value={newTableNum} onChange={(e) => setNewTableNum(e.target.value)}
                                placeholder="Num (e.g. 5)" type="text"
                                className="flex-1 rounded-xl px-3 py-2 text-sm focus:outline-none"
                                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                                onKeyDown={(e) => e.key === 'Enter' && addTable()}
                            />
                            <input 
                                value={newTableCap} onChange={(e) => setNewTableCap(e.target.value)}
                                placeholder="Seats" type="number" min="1"
                                className="w-20 rounded-xl px-3 py-2 text-sm focus:outline-none"
                                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                                onKeyDown={(e) => e.key === 'Enter' && addTable()}
                            />
                            <button 
                                onClick={addTable} disabled={isSaving}
                                className="p-2.5 rounded-xl font-bold transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center shrink-0"
                                style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}
                            >
                                <Plus className="w-4 h-4" weight="bold" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Rooms Manager */}
                <div className="rounded-3xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
                    <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <Bed className="w-5 h-5" weight="fill" /> Hotel Rooms
                    </h3>
                    
                    <div className="mt-5 space-y-3">
                        {rooms.length === 0 ? (
                            <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>No rooms configured.</p>
                        ) : (
                            rooms.map(r => (
                                <div key={r.id} className="flex justify-between items-center p-3 rounded-xl border" style={{ borderColor: 'var(--border)', background: 'var(--bg-input)' }}>
                                    <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Room {r.room_number}</span>
                                    <button onClick={() => deleteRoom(r.id, r.room_number)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-6 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
                        <p className="text-xs font-bold mb-3" style={{ color: 'var(--text-muted)' }}>Add New Room</p>
                        <div className="flex gap-2">
                            <input 
                                value={newRoomNum} onChange={(e) => setNewRoomNum(e.target.value)}
                                placeholder="Room Number/Name" type="text"
                                className="flex-1 rounded-xl px-3 py-2 text-sm focus:outline-none"
                                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                                onKeyDown={(e) => e.key === 'Enter' && addRoom()}
                            />
                            <button 
                                onClick={addRoom} disabled={isSaving}
                                className="p-2.5 rounded-xl font-bold transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center shrink-0"
                                style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}
                            >
                                <Plus className="w-4 h-4" weight="bold" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
