import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST() {
  try {
    await supabase.auth.signOut();
    
    // Clear the auth cookie
    cookies().delete('sb-access-token');
    
    return NextResponse.json({
      success: true
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
