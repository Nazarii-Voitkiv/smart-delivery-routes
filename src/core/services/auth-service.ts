import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AuthResult, LoginCredentials } from '../types/auth';

export class AuthService {
  private client: SupabaseClient;

  constructor(url: string, key: string) {
    this.client = createClient(url, key);
  }

  async signIn(credentials: LoginCredentials): Promise<AuthResult> {
    const { data, error } = await this.client.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });

    if (error) {
      return {
        success: false,
        message: error.message
      };
    }

    return {
      success: true,
      user: data.user,
      session: data.session
    };
  }
}
