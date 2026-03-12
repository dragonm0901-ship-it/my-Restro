import Dexie, { Table } from 'dexie';

// ---------------------------------------------------------
// TYPES (Mirroring Supabase schema)
// ---------------------------------------------------------

export interface LocalCategory {
  id: string; // UUID from Supabase
  name: string;
  sort_order: number;
}

export interface LocalMenuItem {
  id: string; // UUID from Supabase
  category_id: string;
  name: string;
  price: number;
  type: string; // 'food' | 'beverage' | 'other'
  image: string | null;
  is_available: boolean;
}

export interface LocalTable {
  id: string;
  table_number: string;
  capacity: number;
  status: string;
}

export interface LocalHotelRoom {
  id: string;
  room_number: string;
  status: string;
}

export interface LocalIngredient {
  id: string;
  name: string;
  unit: string;
  current_stock: number;
}

export interface SyncQueueOrder {
  local_id?: number; // Auto-increment for local tracking
  type: 'Dine-In' | 'Takeaway' | 'Delivery';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  table_number?: string;
  customer_info?: Record<string, unknown>;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  items: Array<{
    menu_item_id: string;
    quantity: number;
    price_at_time: number;
    notes?: string;
  }>;
  created_at: string;
  sync_status: 'pending' | 'synced' | 'failed';
  error_message?: string;
}

// ---------------------------------------------------------
// DATABASE DEFINITION
// ---------------------------------------------------------

export class RestaurantLocalDB extends Dexie {
  // Define tables
  categories!: Table<LocalCategory, string>;
  menu_items!: Table<LocalMenuItem, string>;
  restaurant_tables!: Table<LocalTable, string>;
  hotel_rooms!: Table<LocalHotelRoom, string>;
  ingredients!: Table<LocalIngredient, string>;
  sync_queue!: Table<SyncQueueOrder, number>;

  constructor() {
    super('RestaurantManagementDB');

    // Define schema
    // ++id means auto-incrementing primary key
    // Other keys mentioned are indexed
    this.version(2).stores({
      categories: 'id, sort_order',
      menu_items: 'id, category_id, type',
      restaurant_tables: 'id, status',
      hotel_rooms: 'id, status',
      ingredients: 'id',
      sync_queue: '++local_id, sync_status, created_at'
    });
  }
}

// Export singleton instance
export const localDb = new RestaurantLocalDB();
