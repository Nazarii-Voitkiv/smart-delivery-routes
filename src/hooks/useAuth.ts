import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export function useAuth() {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const signIn = async ({ email, password }: { email: string; password: string }) => {
        try {
            setIsLoading(true);
            setError(null);

            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (signInError) {
                setError(signInError.message);
                return;
            }

            router.push('/dashboard/orders');
            router.refresh();
        } catch {
            setError('Błąd podczas logowania do systemu');
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        try {
            setIsLoading(true);
            await supabase.auth.signOut();
            router.push('/login');
            router.refresh();
        } catch {
            setError('Błąd podczas wylogowania z systemu');
        } finally {
            setIsLoading(false);
        }
    };

    return { signIn, signOut, isLoading, error };
}