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
    
    // --- GHOST DEMO BYPASS ---
    const isDemoSession = request.cookies.get('myrestro_demo_session')?.value === 'true';
    if (isDemoSession) {
        // If it's a demo session, we skip all Supabase Auth checks and allow access to UI routes
        // We only block API routes that explicitly need a user ID for non-demo purposes
        if (!url.pathname.startsWith('/api') || url.pathname.startsWith('/api/payments')) {
            return supabaseResponse;
        }
    }
    
    // Protect API routes except payments (since payments use S2S webhooks without user sessions)
    if (url.pathname.startsWith('/api') && !url.pathname.startsWith('/api/payments')) {
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    // 3. UI Route Protection
    try {
        if (url.pathname.startsWith('/settings') || url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/kds')) {
            if (!user) {
                url.pathname = '/login';
                return NextResponse.redirect(url);
            }

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

            // Settings Protection
            if (url.pathname.startsWith('/settings')) {
                const isSettingsAdminRoute = url.pathname.startsWith('/settings/floorplan') || url.pathname.startsWith('/settings/billing');
                if (isSettingsAdminRoute && !['admin', 'owner', 'manager'].includes(role || '')) {
                    url.pathname = (role === 'kitchen' || role === 'chef' || isDemoChef) ? '/kds' : '/tables';
                    return NextResponse.redirect(url);
                }
            }

            // KDS Protection
            if (url.pathname.startsWith('/kds')) {
                if (!isDemoChef && !['admin', 'owner', 'kitchen', 'chef'].includes(role || '')) {
                    url.pathname = '/tables';
                    return NextResponse.redirect(url);
                }
            }
        }
    } catch (err) {
        console.error("Middleware processing error:", err);
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
