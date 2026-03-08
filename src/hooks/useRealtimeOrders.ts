'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useOrdersStore, KitchenOrder } from '@/stores/useOrdersStore';
import { useRoleStore } from '@/stores/useRoleStore';

type OrderItemJoin = {
    quantity: number;
    notes: string;
    menu_item_id: string;
    menu_item: {
        name: string;
        image: string;
    } | null;
};

interface DbOrder {
    id: string;
    table_number: number | null;
    order_items: OrderItemJoin[] | null;
    status: string;
    total: number | null;
    created_at: string;
    type: string;
}

import toast from 'react-hot-toast';

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
                .select(`
                    *,
                    order_items (
                        quantity,
                        notes,
                        menu_item_id,
                        menu_item:menu_items (
                            name,
                            image
                        )
                    )
                `)
                .eq('restaurant_id', restaurantId)
                .order('created_at', { ascending: false });

            if (!error && data) {
                // Map DB schema to our frontend Zustand schema
                const mappedOrders: KitchenOrder[] = data.map((dbOrder: DbOrder) => ({
                    id: dbOrder.id,
                    tableNumber: dbOrder.table_number || 0,
                    items: (dbOrder.order_items || []).map((oi: OrderItemJoin) => ({
                        menu_item: {
                            id: oi.menu_item_id,
                            name: oi.menu_item?.name || 'Unknown',
                            image_url: oi.menu_item?.image || '',
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        } as any, // Only UI-required fields mapped for kitchen view
                        quantity: oi.quantity,
                    })),
                    specialNotes: (dbOrder.order_items || []).map((oi: OrderItemJoin) => oi.notes).filter(Boolean).join('. ') || '',
                    status: dbOrder.status as KitchenOrder['status'],
                    total: dbOrder.total || 0,
                    createdAt: dbOrder.created_at,
                    waiterName: dbOrder.type,
                }));
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
                    setTimeout(async () => {
                        const { data } = await supabase
                            .from('orders')
                            .select(`
                                *,
                                order_items (
                                    quantity,
                                    notes,
                                    menu_item_id,
                                    menu_item:menu_items (name, image)
                                )
                            `)
                            .eq('id', dbOrder.id)
                            .single();
                            
                        if (data) {
                            const newOrder: KitchenOrder = {
                                id: data.id,
                                tableNumber: data.table_number || 0,
                                items: (data.order_items || []).map((oi: OrderItemJoin) => ({
                                    menu_item: {
                                        id: oi.menu_item_id,
                                        name: oi.menu_item?.name || 'Unknown',
                                        image_url: oi.menu_item?.image || '',
                                    },
                                    quantity: oi.quantity,
                                })),
                                specialNotes: (data.order_items || []).map((oi: OrderItemJoin) => oi.notes).filter(Boolean).join('. ') || '',
                                status: data.status as KitchenOrder['status'],
                                total: data.total || 0,
                                createdAt: data.created_at,
                                waiterName: data.type,
                            };
                            addOrderLocal(newOrder);
                            toast.success(`New order for Table ${newOrder.tableNumber}!`, {
                                icon: '🔔',
                                duration: 5000,
                            });
                        }
                    }, 1000);
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
                    
                    if (dbOrder.status === 'ready') {
                        toast(`Order ready for Table ${dbOrder.table_number || '?'}!`, {
                            icon: '✅',
                            duration: 4000,
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [restaurantId, setOrders, updateOrderStatusLocal, addOrderLocal, supabase]);
}
