import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow the home page to be public
    if (pathname === '/') {
        return NextResponse.next();
    }

    // Protect /repos and its subroutes
    if (pathname.startsWith('/repos')) {
        // Check for a cookie named 'auth-token'
        const token = request.cookies.get('auth-token');
        if (!token) {
            // Redirect to login or home if not authenticated
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // Allow all other routes by default (customize as needed)
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|api|static|favicon.ico).*)'],
};
