import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';
import { useNotificationStore } from './useNotificationStore';
import { useTableStore } from './useTableStore';

export interface KitchenOrder {
    id: string;
    tableNumber: number;
    items: CartItem[];
    specialNotes: string;
    status: 'pending' | 'preparing' | 'ready' | 'completed';
    total: number;
    createdAt: string;
    waiterName: string;
}

interface OrdersState {
    orders: KitchenOrder[];
    addOrder: (order: Omit<KitchenOrder, 'id' | 'createdAt' | 'status'> & { total: number }) => void;
    updateOrderStatus: (id: string, status: KitchenOrder['status']) => void;
    removeOrder: (id: string) => void;

    // Remote Sync Helpers
    setOrders: (orders: KitchenOrder[]) => void;
    addOrderLocal: (order: KitchenOrder) => void;
    updateOrderStatusLocal: (id: string, status: KitchenOrder['status']) => void;
}

export const useOrdersStore = create<OrdersState>()(
    persist(
        (set) => ({
            orders: [],

            addOrder: async (order) => {
                const newOrder: KitchenOrder = {
                    ...order,
                    id: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                };

                // Set optimistic UI completely local first
                set((state) => ({ orders: [newOrder, ...state.orders] }));

                // Then fire to Supabase in background
                const { createClient } = await import('@/lib/supabase');
                const { useRoleStore } = await import('@/stores/useRoleStore');
                const restaurantId = useRoleStore.getState().restaurantId;

                if (restaurantId) {
                    createClient().from('orders').insert({
                        id: newOrder.id,
                        restaurant_id: restaurantId,
                        table_number: newOrder.tableNumber,
                        items: newOrder.items,
                        status: newOrder.status,
                        notes: newOrder.specialNotes,
                        total: newOrder.total
                    });
                }

                // Mark table as occupied
                useTableStore.getState().occupyTable(order.tableNumber, newOrder.id, order.items.reduce((s, i) => s + i.quantity, 0));

                // Notify chef about new order
                useNotificationStore.getState().addNotification({
                    message: `New order for Table ${order.tableNumber} — ${order.items.length} item${order.items.length > 1 ? 's' : ''}`,
                    type: 'order_new',
                    forRole: 'chef',
                    tableNumber: order.tableNumber,
                    orderId: newOrder.id,
                });

                // Also notify owner
                useNotificationStore.getState().addNotification({
                    message: `Table ${order.tableNumber} placed an order (Rs. ${order.total.toFixed(0)})`,
                    type: 'order_new',
                    forRole: 'owner',
                    tableNumber: order.tableNumber,
                    orderId: newOrder.id,
                });
            },

            updateOrderStatus: (id, status) => {
                set((state) => {
                    const order = state.orders.find((o) => o.id === id);
                    if (order) {
                        // Notify waiter about status change
                        if (status === 'preparing') {
                            useNotificationStore.getState().addNotification({
                                message: `Table ${order.tableNumber} — order is now being prepared`,
                                type: 'order_status',
                                forRole: 'waiter',
                                tableNumber: order.tableNumber,
                                orderId: id,
                            });
                        } else if (status === 'ready') {
                            useNotificationStore.getState().addNotification({
                                message: `Table ${order.tableNumber} — food is READY for pickup!`,
                                type: 'order_status',
                                forRole: 'waiter',
                                tableNumber: order.tableNumber,
                                orderId: id,
                            });
                            useNotificationStore.getState().addNotification({
                                message: `Table ${order.tableNumber} order ready for service`,
                                type: 'order_status',
                                forRole: 'owner',
                                tableNumber: order.tableNumber,
                                orderId: id,
                            });
                        } else if (status === 'completed') {
                            useNotificationStore.getState().addNotification({
                                message: `Table ${order.tableNumber} — order completed`,
                                type: 'order_status',
                                forRole: 'all',
                                tableNumber: order.tableNumber,
                                orderId: id,
                            });
                        }
                    }
                    return {
                        orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
                    };
                });

                // Fire to Supabase 
                import('@/lib/supabase').then(({ createClient }) => {
                    createClient().from('orders').update({ status }).eq('id', id);
                });
            },

            removeOrder: (id) => {
                set((state) => ({
                    orders: state.orders.filter((o) => o.id !== id),
                }));
                import('@/lib/supabase').then(({ createClient }) => {
                    createClient().from('orders').delete().eq('id', id);
                });
            },

            // --- LOCAL SYNC ACTIONS ---
            setOrders: (orders) => set({ orders }),

            addOrderLocal: (order) => set((state) => {
                if (state.orders.find(o => o.id === order.id)) return state;
                return { orders: [order, ...state.orders] };
            }),

            updateOrderStatusLocal: (id, status) => set((state) => ({
                orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
            }))
        }),
        { name: 'restaurant-orders' }
    )
);
