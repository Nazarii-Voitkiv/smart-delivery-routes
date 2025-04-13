import { getSupabaseClient } from '@/infrastructure/supabase/client';
import { ApiClient } from '@/infrastructure/http/api-client';
import { AuthService, AuthSession, LoginCredentials, UserProfile } from '@/core/types/auth';

export class SupabaseAuthService implements AuthService {
  async signIn(credentials: LoginCredentials): Promise<{
    user: UserProfile | null;
    session: AuthSession | null;
    error?: string;
  }> {
    try {
      const response = await ApiClient.post<{
        success: boolean;
        user?: UserProfile;
        session?: AuthSession;
        message?: string;
      }>('/api/auth', credentials);

      if (!response.success) {
        return { 
          user: null, 
          session: null, 
          error: response.message || 'Authentication failed'
        };
      }

      return {
        user: response.user || null,
        session: response.session || null
      };
    } catch (error) {
      if (error instanceof Error) {
        return { user: null, session: null, error: error.message };
      }
      return { user: null, session: null, error: 'Unknown authentication error' };
    }
  }

  async signOut(): Promise<void> {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    await ApiClient.post<{ success: boolean }>('/api/auth/logout', {});
  }

  async getCurrentUser(): Promise<UserProfile | null> {
    const supabase = getSupabaseClient();
    const { data } = await supabase.auth.getUser();
    
    if (!data.user) {
      return null;
    }
    
    return {
      id: data.user.id,
      email: data.user.email || '',
      role: 'user' // Would be determined by your user data
    };
  }
}

export const authService = new SupabaseAuthService();
