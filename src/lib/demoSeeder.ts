import { useOrdersStore, KitchenOrder } from '@/stores/useOrdersStore';
import { useTableStore, RestaurantTable } from '@/stores/useTableStore';

export const seedDemoData = () => {
    // 1. Seed Tables
    const tableStore = useTableStore.getState();
    const demoTables: RestaurantTable[] = [
        { id: 1, label: 'T1', seats: 2, status: 'occupied', guestCount: 2, occupiedSince: new Date(Date.now() - 45 * 60000).toISOString() },
        { id: 2, label: 'T2', seats: 2, status: 'vacant' },
        { id: 3, label: 'T3', seats: 4, status: 'occupied', guestCount: 3, occupiedSince: new Date(Date.now() - 20 * 60000).toISOString() },
        { id: 4, label: 'T4', seats: 4, status: 'needs_attention', guestCount: 4, occupiedSince: new Date(Date.now() - 90 * 60000).toISOString() },
        { id: 5, label: 'T5', seats: 6, status: 'vacant' },
        { id: 6, label: 'T6', seats: 6, status: 'occupied', guestCount: 5, occupiedSince: new Date(Date.now() - 10 * 60000).toISOString() },
    ];
    
    // Merge or replace tables
    tableStore.tables.forEach(t => {
        const demo = demoTables.find(dt => dt.id === t.id);
        if (demo) tableStore.setTableStatus(demo.id, demo.status, undefined, demo.guestCount);
    });

    // 2. Seed Orders
    const orderStore = useOrdersStore.getState();
    if (orderStore.orders.length < 3) {
        const demoOrders: KitchenOrder[] = [
            {
                id: 'ORD-DEMO-001',
                tableNumber: 1,
                items: [
                    { id: '1', menu_item: { name: 'Chicken Momo' }, price: 250, quantity: 2, category: 'Appetizer' } as any,
                    { id: '2', menu_item: { name: 'Masala Tea' }, price: 50, quantity: 2, category: 'Beverage' } as any
                ],
                total: 600,
                status: 'preparing',
                createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
                waiterName: 'Demo Waiter',
                specialNotes: 'Less spicy please'
            },
            {
                id: 'ORD-DEMO-002',
                tableNumber: 3,
                items: [
                    { id: '3', menu_item: { name: 'Thakali Set' }, price: 450, quantity: 3, category: 'Main Course' } as any,
                ],
                total: 1350,
                status: 'pending',
                createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
                waiterName: 'Demo Waiter',
                specialNotes: ''
            },
            {
                id: 'ORD-DEMO-003',
                tableNumber: 4,
                items: [
                    { id: '4', menu_item: { name: 'Buff Sukuti' }, price: 300, quantity: 1, category: 'Appetizer' } as any,
                    { id: '5', menu_item: { name: 'Everest Beer' }, price: 550, quantity: 2, category: 'Beverage' } as any
                ],
                total: 1400,
                status: 'ready',
                createdAt: new Date(Date.now() - 40 * 60000).toISOString(),
                waiterName: 'Demo Waiter',
                specialNotes: ''
            }
        ];
        orderStore.setOrders([...demoOrders, ...orderStore.orders]);
    }
};
