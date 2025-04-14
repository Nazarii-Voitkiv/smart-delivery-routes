import { Session, User } from '@supabase/supabase-js';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export interface AuthResult {
  success: boolean;
  message?: string;
  user?: User | null;
  session?: Session | null;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'user' | 'courier';
}

export interface AuthState {
  user: UserProfile | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface AuthService {
  signIn(credentials: LoginCredentials): Promise<{
    user: UserProfile | null;
    session: AuthSession | null;
    error?: string;
  }>;
  
  signOut(): Promise<void>;
  
  getCurrentUser(): Promise<UserProfile | null>;
}
