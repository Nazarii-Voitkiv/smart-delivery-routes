import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/utils/supabase';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('sb-access-token')?.value;
    
    if (!token) {
      return NextResponse.json({ authenticated: false });
    }
    
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      return NextResponse.json({ authenticated: false });
    }
    
    return NextResponse.json({ 
      authenticated: true,
      user: {
        id: data.user.id,
        email: data.user.email
      }
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}
