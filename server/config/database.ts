import { createClient } from '@supabase/supabase-js';
import { config } from './config';

if (!config.supabase.url || !config.supabase.anonKey) {
  console.warn('Warning: Supabase configuration not found. Database operations may fail.');
}

export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      persistSession: false
    }
  }
);

// Helper function to get admin client (for server-side operations)
export const getAdminClient = (serviceRoleKey?: string) => {
  if (!serviceRoleKey) {
    return supabase;
  }
  return createClient(config.supabase.url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
};
