import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class SupabaseInstance {
  private static instance: SupabaseClient;
  private static initialized = false;

  private static createInstance(): SupabaseClient {
    // For client-side usage only (development purposes)
    // In production, use API routes exclusively
    const supabaseUrl = 'https://dkdanxawuzzemwvzglpp.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrZGFueGF3dXp6ZW13dnpnbHBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg4MDY4NzEsImV4cCI6MjA1NDM4Mjg3MX0.s0d_HVoivFaVqRG5jzf6bfCbMj6ZMky1Syjm3ogQNHc';

    return createClient(supabaseUrl, supabaseKey);
  }

  public static getInstance(): SupabaseClient {
    if (!this.initialized) {
      this.instance = this.createInstance();
      this.initialized = true;
    }
    return this.instance;
  }
}

export const getSupabaseClient = (): SupabaseClient => {
  return SupabaseInstance.getInstance();
};
