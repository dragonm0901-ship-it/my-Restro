import { createClient } from './supabase';

export interface SubscriptionFeatureLimits {
    maxStaff: number;
    maxMenuItems: number;
    hasAds: boolean;
    hasPrioritySupport: boolean;
    hasRealtimeKds: boolean;
}

export interface SubscriptionStatus {
    isActive: boolean;
    isTrial: boolean;
    status: string;
    endDate: Date | null;
    planName: string;
    limits: SubscriptionFeatureLimits;
}

export async function getRestaurantSubscription(restaurantId: string): Promise<SubscriptionStatus | null> {
    const supabase = createClient();

    try {
        // Fetch the active subscription and join with the plan details
        const { data, error } = await supabase
            .from('restaurant_subscriptions')
            .select(`
                status,
                current_period_end,
                subscription_plans (
                    name,
                    max_staff,
                    max_menu_items,
                    price_npr
                )
            `)
            .eq('restaurant_id', restaurantId)
            .single();

        if (error || !data) {
            console.error("No subscription found for restaurant:", error);
            return null;
        }

        const plan = data.subscription_plans as unknown as {
            name: string;
            max_staff: number;
            max_menu_items: number;
            price_npr: number;
        };
        const endDate = new Date(data.current_period_end);
        const now = new Date();

        const isActive = data.status === 'active' || data.status === 'trialing';
        // Check if past current_period_end (allow 1 day grace period)
        const isExpired = endDate < new Date(now.setDate(now.getDate() - 1));

        return {
            isActive: isActive && !isExpired,
            isTrial: data.status === 'trialing',
            status: isExpired ? 'past_due' : data.status,
            endDate,
            planName: plan.name,
            limits: {
                maxStaff: plan.max_staff,
                maxMenuItems: plan.max_menu_items,
                hasAds: plan.price_npr === 0,
                hasPrioritySupport: plan.price_npr > 0,
                hasRealtimeKds: plan.price_npr > 0, // Gate KDS behind paid plan
            }
        };

    } catch (err) {
        console.error("Error fetching subscription limits:", err);
        return null;
    }
}
