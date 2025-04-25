import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (!path.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  const supabaseAuthToken = req.cookies.get('sb-access-token')?.value;
  
  if (!supabaseAuthToken) {
    const url = new URL('/login', req.url);
    url.searchParams.set('from', path);
    return NextResponse.redirect(url);
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(supabaseAuthToken);
    
    if (error || !user) {
      throw new Error('Invalid token');
    }

    return NextResponse.next();
  } catch (error) { // Making sure catch block is present
    const url = new URL('/login', req.url);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/dashboard/:path*']
};
