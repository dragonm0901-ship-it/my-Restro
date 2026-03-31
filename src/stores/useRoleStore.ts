import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'staff' | 'kitchen' | 'owner' | 'waiter' | 'chef';

interface RoleState {
    role: UserRole | null;
    userName: string;
    restaurantId?: string;
    isDemo: boolean;
    setRole: (role: UserRole, name?: string, restaurant_id?: string) => void;
    setDemo: (role: UserRole) => void;
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
            isDemo: false,
            setRole: (role, name, restaurantId) => set({ role, userName: name || defaultNames[role], restaurantId, isDemo: false }),
            setDemo: (role) => set({ 
                role, 
                userName: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`, 
                restaurantId: 'demo-restro-id', 
                isDemo: true 
            }),
            logout: () => {
                // Clear demo cookie if it exists
                document.cookie = "myrestro_demo_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                set({ role: null, userName: '', restaurantId: undefined, isDemo: false });
            },
        }),
        { name: 'restaurant-role' }
    )
);
