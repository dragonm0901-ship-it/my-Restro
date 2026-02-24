'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useOrdersStore, KitchenOrder } from '@/stores/useOrdersStore';
import { useRoleStore } from '@/stores/useRoleStore';

export function useRealtimeOrders() {
    const { restaurantId } = useRoleStore();
    const { setOrders, updateOrderStatusLocal, addOrderLocal } = useOrdersStore();
    const supabase = createClient();

    useEffect(() => {
        if (!restaurantId) return;

        // 1. Fetch initial orders for the active restaurant
        const fetchInitialOrders = async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('restaurant_id', restaurantId)
                .order('created_at', { ascending: false });

            if (!error && data) {
                // Map DB schema to our frontend Zustand schema
                const mappedOrders: KitchenOrder[] = data.map(dbOrder => ({
                    id: dbOrder.id,
                    tableNumber: dbOrder.table_number || 0,
                    items: dbOrder.items || [],
                    specialNotes: dbOrder.notes || '',
                    status: dbOrder.status as KitchenOrder['status'],
                    total: dbOrder.total || 0,
                    createdAt: dbOrder.created_at,
                    waiterName: "Staff", // Ideally fetched from profiles join
                }));
                // Set directly via store action (we need to add this to useOrdersStore next)
                setOrders(mappedOrders);
            }
        };

        fetchInitialOrders();

        // 2. Subscribe to Realtime changes on the 'orders' table for this restaurant
        const channel = supabase.channel('kitchen_orders')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'orders',
                    filter: `restaurant_id=eq.${restaurantId}`
                },
                (payload) => {
                    const dbOrder = payload.new;
                    const newOrder: KitchenOrder = {
                        id: dbOrder.id,
                        tableNumber: dbOrder.table_number || 0,
                        items: dbOrder.items || [],
                        specialNotes: dbOrder.notes || '',
                        status: dbOrder.status as KitchenOrder['status'],
                        total: dbOrder.total || 0,
                        createdAt: dbOrder.created_at,
                        waiterName: "Staff",
                    };
                    addOrderLocal(newOrder);
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                    filter: `restaurant_id=eq.${restaurantId}`
                },
                (payload) => {
                    const dbOrder = payload.new;
                    updateOrderStatusLocal(dbOrder.id, dbOrder.status as KitchenOrder['status']);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [restaurantId, setOrders, updateOrderStatusLocal, addOrderLocal, supabase]);
}
