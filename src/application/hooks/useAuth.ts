import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/domain/services/auth-service';
import { AuthState, LoginCredentials } from '@/core/types/auth';

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: false,
  isAuthenticated: false,
  error: null
};

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>(initialState);
  
  const resetError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const signIn = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { user, session, error } = await authService.signIn(credentials);
      
      if (error || !user) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: error || 'Authentication failed' 
        }));
        return false;
      }
      
      setState({
        user,
        session,
        isLoading: false,
        isAuthenticated: true,
        error: null
      });
      
      router.push('/dashboard');
      return true;
    } catch (error) {
      if (error instanceof Error) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: error.message 
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'An unexpected error occurred' 
        }));
      }
      return false;
    }
  }, [router]);

  const signOut = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await authService.signOut();
      setState(initialState);
      router.push('/login');
    } catch (error) {
      if (error instanceof Error) {
        setState(prev => ({ ...prev, isLoading: false, error: error.message }));
      }
    }
  }, [router]);

  return {
    ...state,
    signIn,
    signOut,
    resetError
  };
}
