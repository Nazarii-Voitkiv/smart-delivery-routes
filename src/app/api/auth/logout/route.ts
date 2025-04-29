import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    await supabase.auth.signOut();
    
    const headers = new Headers();
    headers.append('Set-Cookie', 'sb-access-token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax');
    headers.append('Set-Cookie', 'sb-refresh-token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax');
    
    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers
      }
    );
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
