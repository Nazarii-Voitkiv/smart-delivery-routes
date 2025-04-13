import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export interface AuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
  } | null;
  session?: {
    access_token: string;
  } | null;
  message?: string;
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
