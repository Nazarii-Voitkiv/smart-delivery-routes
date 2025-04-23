import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function middleware(req: NextRequest) {
  // Get the pathname
  const path = req.nextUrl.pathname;

  // Skip middleware for non-dashboard paths
  if (!path.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  // Get auth cookie
  const supabaseAuthToken = req.cookies.get('sb-access-token')?.value;
  
  // If no token, redirect to login
  if (!supabaseAuthToken) {
    const url = new URL('/login', req.url);
    url.searchParams.set('from', path);
    return NextResponse.redirect(url);
  }

  try {
    // Verify the token
    const { data: { user }, error } = await supabase.auth.getUser(supabaseAuthToken);
    
    if (error || !user) {
      throw new Error('Invalid token');
    }

    // User is authenticated, allow access
    return NextResponse.next();
  } catch (error) {
    // Invalid token or other error, redirect to login
    const url = new URL('/login', req.url);
    return NextResponse.redirect(url);
  }
}

// Configure middleware to run on specific paths
export const config = {
  matcher: ['/dashboard/:path*']
};
