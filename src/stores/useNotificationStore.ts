import { create } from 'zustand';

export interface AppNotification {
    id: string;
    message: string;
    type: 'order_new' | 'order_status' | 'info';
    forRole: 'owner' | 'waiter' | 'chef' | 'all';
    tableNumber?: number;
    orderId?: string;
    read: boolean;
    createdAt: string;
}

interface NotificationState {
    notifications: AppNotification[];
    addNotification: (n: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => void;
    markRead: (id: string) => void;
    markAllRead: () => void;
    clearAll: () => void;
    getUnreadCount: (role: string) => number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],

    addNotification: (n) => {
        const notification: AppNotification = {
            ...n,
            id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
            read: false,
            createdAt: new Date().toISOString(),
        };
        set((state) => ({
            notifications: [notification, ...state.notifications].slice(0, 50),
        }));
    },

    markRead: (id) => {
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
            ),
        }));
    },

    markAllRead: () => {
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
    },

    clearAll: () => set({ notifications: [] }),

    getUnreadCount: (role) => {
        return get().notifications.filter(
            (n) => !n.read && (n.forRole === role || n.forRole === 'all')
        ).length;
    },
}));
