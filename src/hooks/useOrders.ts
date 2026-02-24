'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase';
import { MenuItem, Order, CartItem } from '@/types';
import toast from 'react-hot-toast';

const supabase = createClient();

// ============================================================
// Menu Items
// ============================================================
export function useMenuItems(category?: string) {
    return useQuery({
        queryKey: ['menu-items', category],
        queryFn: async () => {
            let query = supabase
                .from('menu_items')
                .select('*')
                .eq('is_available', true)
                .order('category')
                .order('name');

            if (category && category !== 'all') {
                query = query.ilike('category', category.replace(/-/g, ' '));
            }

            const { data, error } = await query;
            if (error) throw error;
            return data as MenuItem[];
        },
    });
}

// ============================================================
// Orders
// ============================================================
export function useOrders(status?: string) {
    return useQuery({
        queryKey: ['orders', status],
        queryFn: async () => {
            let query = supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (status) {
                query = query.eq('status', status);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data as Order[];
        },
    });
}

export function useCreateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            items,
            total,
            tableNumber,
            notes,
        }: {
            items: CartItem[];
            total: number;
            tableNumber?: number;
            notes?: string;
        }) => {
            const { data, error } = await supabase
                .from('orders')
                .insert({
                    items: JSON.stringify(items),
                    total,
                    table_number: tableNumber,
                    notes,
                    status: 'pending',
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            toast.success('Order placed successfully!');
        },
        onError: (error: Error) => {
            toast.error(`Failed to place order: ${error.message}`);
        },
    });
}

export function useUpdateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            updates,
        }: {
            id: string;
            updates: Partial<Order>;
        }) => {
            const { data, error } = await supabase
                .from('orders')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to update order: ${error.message}`);
        },
    });
}

export function useDeleteOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('orders').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            toast.success('Order cancelled');
        },
        onError: (error: Error) => {
            toast.error(`Failed to cancel order: ${error.message}`);
        },
    });
}
