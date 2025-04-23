import { createClient } from '@supabase/supabase-js';

// Використовуємо NEXT_PUBLIC_ для змінних оточення на стороні клієнта
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Перевірка наявності необхідних змінних оточення
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Fallback values will be used if available.');
}

// Створюємо Supabase клієнт
export const supabase = createClient(
  supabaseUrl || 'https://dkdanxawuzzemwvzglpp.supabase.co', 
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrZGFueGF3dXp6ZW13dnpnbHBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg4MDY4NzEsImV4cCI6MjA1NDM4Mjg3MX0.s0d_HVoivFaVqRG5jzf6bfCbMj6ZMky1Syjm3ogQNHc'
);
