export type UserRole = 'admin' | 'staff' | 'kitchen';

export interface Profile {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    avatar_url?: string;
}

export interface MenuItem {
    id: string;
    name: string;
    name_np?: string;
    description: string;
    price: number;
    category: string;
    image_url: string;
    sizes?: string[];
    variations?: string[];
    spice_levels?: string[];
    is_available: boolean;
    created_at?: string;
}

export interface CartItem {
    menu_item: MenuItem;
    quantity: number;
    selected_size?: string;
    selected_variation?: string;
    selected_spice?: string;
    extras?: string[];
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface Order {
    id: string;
    user_id: string;
    status: OrderStatus;
    total: number;
    items: CartItem[];
    table_number?: number;
    notes?: string;
    created_at: string;
    updated_at?: string;
}
