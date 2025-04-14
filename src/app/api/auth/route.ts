import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { AuthService } from '@/core/services/auth-service';
import { LoginCredentials } from '@/core/types/auth';
import { config } from '@/config/environment';

export async function POST(request: NextRequest) {
  try {
    const authService = new AuthService(config.supabase.url, config.supabase.anonKey);
    const credentials: LoginCredentials = await request.json();
    
    if (!credentials.email || !credentials.password) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 400 }
      );
    }
    
    const result = await authService.signIn(credentials);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    await cookieStore.set({
      name: 'sb-access-token',
      value: result.session!.access_token,
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    
    return NextResponse.json({ success: true });
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
