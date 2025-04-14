export const getRequiredEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const config = {
  supabase: {
    url: getRequiredEnvVar('SUPABASE_URL'),
    anonKey: getRequiredEnvVar('SUPABASE_ANON_KEY')
  }
};
