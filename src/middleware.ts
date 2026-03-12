import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                    supabaseResponse = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    supabaseResponse.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                    supabaseResponse = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    supabaseResponse.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                },
            },
        }
    );

    let user = null;
    try {
        const { data } = await supabase.auth.getUser();
        user = data.user;
    } catch (err) {
        // Ignored: Typically "Invalid Refresh Token" when session expires
    }

    const url = request.nextUrl.clone();
    
    // Protect API routes except payments (since payments use S2S webhooks without user sessions)
    if (url.pathname.startsWith('/api') && !url.pathname.startsWith('/api/payments')) {
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    // Role-based protection for sensitive UI Routes
    if (url.pathname.startsWith('/settings') || url.pathname.startsWith('/dashboard')) {
        if (!user) {
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }

        // Fetch user profile to get their role server-side
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();

        let role = profile?.role;
        const isDemoOwner = user.email === 'demo.owner@example.com';
        const isDemoChef = user.email === 'demo.chef@example.com';
        const isDemoWaiter = user.email === 'demo.waiter@example.com';

        if (!role) {
            if (isDemoOwner) role = 'owner';
            else if (isDemoChef) role = 'chef';
            else if (isDemoWaiter) role = 'waiter';
        }
        
        // Only admins, owners, and managers can access settings. Waiters can access profile but not floorplan/billing
        if (url.pathname.startsWith('/settings')) {
            const isSettingsAdminRoute = url.pathname.startsWith('/settings/floorplan') || url.pathname.startsWith('/settings/billing');
            
            if (isSettingsAdminRoute && !['admin', 'owner', 'manager'].includes(role || '')) {
                url.pathname = (role === 'kitchen' || role === 'chef' || isDemoChef) ? '/kds' : '/tables';
                return NextResponse.redirect(url);
            }
        }
    }

    // Kitchen specific route
    if (url.pathname.startsWith('/kds')) {
         if (!user) {
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }

        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        const role = profile?.role;
        const isDemoChef = user.email === 'demo.chef@example.com';
        
        if (!isDemoChef && role !== 'admin' && role !== 'owner' && role !== 'kitchen' && role !== 'chef') {
            url.pathname = '/tables';
            return NextResponse.redirect(url);
        }
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
