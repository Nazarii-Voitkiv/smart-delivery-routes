import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    const { data: { session } } = await supabase.auth.getSession()
    
    const path = req.nextUrl.pathname

    if (path.startsWith('/dashboard') && !session) {
        const url = new URL('/login', req.url)
        url.searchParams.set('from', path)
        return NextResponse.redirect(url)
    }

    return res
}

export const config = {
    matcher: ['/dashboard/:path*']
}