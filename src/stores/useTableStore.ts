import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TableStatus = 'vacant' | 'occupied' | 'needs_attention' | 'reserved';

export interface RestaurantTable {
    id: number;
    label: string;
    seats: number;
    status: TableStatus;
    orderId?: string;
    guestCount?: number;
    occupiedSince?: string;
}

interface TableState {
    tables: RestaurantTable[];
    setTableStatus: (id: number, status: TableStatus, orderId?: string, guestCount?: number) => void;
    occupyTable: (id: number, orderId: string, guestCount?: number) => void;
    vacateTable: (id: number) => void;
    getTable: (id: number) => RestaurantTable | undefined;
}

const defaultTables: RestaurantTable[] = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    label: `T${i + 1}`,
    seats: i < 4 ? 2 : i < 8 ? 4 : 6,
    status: 'vacant' as TableStatus,
}));

export const useTableStore = create<TableState>()(
    persist(
        (set, get) => ({
            tables: defaultTables,

            setTableStatus: (id, status, orderId, guestCount) => {
                set((state) => ({
                    tables: state.tables.map((t) =>
                        t.id === id
                            ? {
                                ...t,
                                status,
                                orderId: orderId ?? t.orderId,
                                guestCount: guestCount ?? t.guestCount,
                                occupiedSince: status === 'occupied' ? (t.occupiedSince || new Date().toISOString()) : t.occupiedSince,
                            }
                            : t
                    ),
                }));
            },

            occupyTable: (id, orderId, guestCount) => {
                set((state) => ({
                    tables: state.tables.map((t) =>
                        t.id === id
                            ? { ...t, status: 'occupied' as TableStatus, orderId, guestCount, occupiedSince: new Date().toISOString() }
                            : t
                    ),
                }));
            },

            vacateTable: (id) => {
                set((state) => ({
                    tables: state.tables.map((t) =>
                        t.id === id
                            ? { ...t, status: 'vacant' as TableStatus, orderId: undefined, guestCount: undefined, occupiedSince: undefined }
                            : t
                    ),
                }));
            },

            getTable: (id) => get().tables.find((t) => t.id === id),
        }),
        { name: 'restaurant-tables' }
    )
);
