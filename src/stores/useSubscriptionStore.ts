import { create } from 'zustand';
import { getRestaurantSubscription, SubscriptionStatus } from '@/lib/subscription';

interface SubscriptionState {
    subscription: SubscriptionStatus | null;
    isLoading: boolean;
    fetchSubscription: (restaurantId: string) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
    subscription: null,
    isLoading: false,

    fetchSubscription: async (restaurantId: string) => {
        set({ isLoading: true });
        try {
            const sub = await getRestaurantSubscription(restaurantId);
            set({ subscription: sub, isLoading: false });
        } catch (error) {
            console.error("Failed to fetch subscription:", error);
            set({ isLoading: false, subscription: null });
        }
    }
}));
