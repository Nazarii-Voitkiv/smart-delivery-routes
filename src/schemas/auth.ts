import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Wprowadź poprawny email'),
    password: z.string().min(6, 'Hasło musi zawierać co najmniej 6 znaków')
});

export type LoginFormValues = z.infer<typeof loginSchema>;