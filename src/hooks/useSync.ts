import { useEffect, useState, useCallback } from 'react';
import { useNetworkState } from 'react-use';
import { localDb } from '@/lib/db/localDb';
import { createClient } from '@/lib/supabase';
import { useRoleStore } from '@/stores/useRoleStore';

export function useSync() {
  const { online } = useNetworkState();
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const supabase = createClient();
  const restaurantId = useRoleStore((state) => state.restaurantId);

  // 1. Initial Pull: Download categories and menu items to IndexedDB
  // Call this once on app mount or POS open when online
  const syncDown = useCallback(async () => {
    if (!online) return;
    
    try {
      if (!restaurantId) return;
      // Fetch for the specific authenticated restaurant_id
      const { data: catData, error: catErr } = await supabase.from('categories').select('*').eq('restaurant_id', restaurantId);
      if (!catErr && catData) {
        await localDb.categories.bulkPut(catData);
      }

      const { data: menuData, error: menuErr } = await supabase.from('menu_items').select('*').eq('restaurant_id', restaurantId);
      if (!menuErr && menuData) {
        await localDb.menu_items.bulkPut(menuData);
      }
    } catch (error) {
      console.error('Failed to sync down inventory:', error);
    }
  }, [online, supabase, restaurantId]);


  // 2. Sync Up: Push offline orders to Supabase
  const syncUp = useCallback(async () => {
    if (!online || isSyncing) return;
    
    setIsSyncing(true);
    try {
      // Get all pending orders
      const pendingOrders = await localDb.sync_queue
        .where('sync_status')
        .equals('pending')
        .toArray();

      if (pendingOrders.length === 0) {
        setPendingCount(0);
        setIsSyncing(false);
        return;
      }

      setPendingCount(pendingOrders.length);

      for (const queueOrder of pendingOrders) {
        try {
          // Destructure out the local_id and items to insert order header
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { local_id, items, sync_status: _syncStatus, error_message: _errMsg, ...orderData } = queueOrder;
          
          // Needs valid restaurant_id
          const payload = {
            ...orderData,
            restaurant_id: restaurantId, 
          };

          // Try inserting to Supabase
          const { data: newOrder, error: orderErr } = await supabase
            .from('orders')
            .insert(payload)
            .select()
            .single();

          if (orderErr) throw orderErr;

          // Insert Order Items
          if (newOrder && items.length > 0) {
            const orderItemsPayload = items.map(item => ({
              ...item,
              order_id: newOrder.id,
            }));
            
            const { error: itemsErr } = await supabase
              .from('order_items')
              .insert(orderItemsPayload);

            if (itemsErr) throw itemsErr;
          }

          // Mark as synced locally
          if (local_id) {
            await localDb.sync_queue.update(local_id, { sync_status: 'synced' });
          }
          
        } catch (orderError: unknown) {
          const errMsg = orderError instanceof Error ? orderError.message : 'Unknown error';
          console.error(`Failed to sync order ${queueOrder.local_id}:`, errMsg);
          // Mark as failed so we can retry or investigate
          if (queueOrder.local_id) {
            await localDb.sync_queue.update(queueOrder.local_id, { 
              sync_status: 'failed', 
              error_message: errMsg 
            });
          }
        }
      }

    } catch (error) {
      console.error('Master syncUp failed:', error);
    } finally {
      // Update pending count
      const remaining = await localDb.sync_queue.where('sync_status').equals('pending').count();
      setPendingCount(remaining);
      setIsSyncing(false);
    }
  }, [online, isSyncing, supabase, restaurantId]);


  // Auto-trigger syncUp when connection is restored
  useEffect(() => {
    if (online) {
      syncDown();
      syncUp();
    }
  }, [online, syncDown, syncUp]);

  // Hook to manually add an order to the queue (called from checkout)
  const enqueueOrder = async (orderData: Omit<import('@/lib/db/localDb').SyncQueueOrder, 'sync_status' | 'created_at'>) => {
    const newId = await localDb.sync_queue.add({
      ...orderData,
      sync_status: 'pending',
      created_at: new Date().toISOString()
    });
    
    // Trigger aggressive sync immediately if online
    if (online) {
      syncUp();
    } else {
      setPendingCount(prev => prev + 1);
    }
    
    return newId;
  };

  return {
    isOnline: online,
    isSyncing,
    pendingCount,
    enqueueOrder,
    forceSync: syncUp
  };
}
