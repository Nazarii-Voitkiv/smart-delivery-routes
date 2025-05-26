'use client';

import Link from "next/link";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '@/schemas/auth';
import { useAuth } from '@/hooks/useAuth';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';

export default function Login() {
  const { signIn, isLoading, error: authError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    await signIn(data);
  };

  return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-md p-8 rounded-lg shadow-md bg-white">
          <h1 className="text-2xl font-bold mb-6 text-center">Logowanie</h1>

          {authError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {authError}
              </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
                label="Email"
                id="email"
                type="email"
                autoComplete="email"
                error={errors.email}
                {...register('email')}
            />

            <FormInput
                label="Hasło"
                id="password"
                type="password"
                autoComplete="current-password"
                error={errors.password}
                {...register('password')}
            />

            <Button
                type="submit"
                isLoading={isLoading}
                fullWidth
            >
              Zaloguj się
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-blue-600 hover:underline">
              Powrót do strony głównej
            </Link>
          </div>
        </div>
      </div>
  );
}