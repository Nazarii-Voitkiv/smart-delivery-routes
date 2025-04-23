import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.email || !body.password) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password
    });
    
    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }

    // Fixed: await the cookies() function before calling methods on it
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'sb-access-token',
      value: data.session.access_token,
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    
    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session
    });
    
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
