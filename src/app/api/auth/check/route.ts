import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(req: NextRequest) {
  try {
    const token = cookies().get('sb-access-token')?.value;
    
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
