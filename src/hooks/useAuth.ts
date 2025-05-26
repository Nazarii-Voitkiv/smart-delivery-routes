import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export function useAuth() {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const signIn = async ({ email, password }) => {
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

            router.push('/dashboard');
            router.refresh();
        } catch (err) {
            setError('Ошибка при входе в систему');
        } finally {
            setIsLoading(false);
        }
    };

    return { signIn, isLoading, error };
}