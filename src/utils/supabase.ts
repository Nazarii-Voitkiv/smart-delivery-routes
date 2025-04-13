import { createClient } from '@supabase/supabase-js';

// For client-side usage in development
const supabaseUrl = 'https://dkdanxawuzzemwvzglpp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrZGFueGF3dXp6ZW13dnpnbHBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg4MDY4NzEsImV4cCI6MjA1NDM4Mjg3MX0.s0d_HVoivFaVqRG5jzf6bfCbMj6ZMky1Syjm3ogQNHc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
