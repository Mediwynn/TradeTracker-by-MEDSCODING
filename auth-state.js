let clientPromise;

export function getAuthClient() {
  const config = window.TRADE_TRACKER_AUTH_CONFIG;
  if (!config?.url || !config?.anonKey) return Promise.resolve(null);

  if (!clientPromise) {
    clientPromise = import("https://esm.sh/@supabase/supabase-js@2").then(({ createClient }) =>
      createClient(config.url, config.anonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      })
    );
  }
  return clientPromise;
}

export async function hasAuthenticatedSession() {
  const client = await getAuthClient();
  if (!client) return false;

  const { data, error } = await client.auth.getSession();
  if (error) throw error;
  return Boolean(data.session?.user);
}
