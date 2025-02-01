import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    // Check if the current path is not '/dashboard'
    if (request.nextUrl.pathname !== '/dashboard') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If already on the '/dashboard' page, don't redirect
    return NextResponse.next(); // Allow the request to continue as is
}
