import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'staff' | 'kitchen' | 'owner' | 'waiter' | 'chef';

interface RoleState {
    role: UserRole | null;
    userName: string;
    restaurantId?: string;
    setRole: (role: UserRole, name?: string, restaurantId?: string) => void;
    logout: () => void;
}

const defaultNames: Record<UserRole, string> = {
    owner: 'Admin',
    waiter: 'Waiter',
    chef: 'Chef',
    admin: 'Admin',
    staff: 'Staff',
    kitchen: 'Kitchen',
};

export const useRoleStore = create<RoleState>()(
    persist(
        (set) => ({
            role: null,
            userName: '',
            restaurantId: undefined,
            setRole: (role, name, restaurantId) => set({ role, userName: name || defaultNames[role], restaurantId }),
            logout: () => set({ role: null, userName: '', restaurantId: undefined }),
        }),
        { name: 'restaurant-role' }
    )
);
