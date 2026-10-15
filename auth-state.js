let clientPromise;
const LOCAL_ADMIN_TEST_SESSION = "trade-tracker-local-admin-test";

export function hasLocalAdminTestSession() {
  if (!["localhost", "127.0.0.1", "::1"].includes(window.location.hostname)) return false;
  try {
    return sessionStorage.getItem(LOCAL_ADMIN_TEST_SESSION) === "true";
  } catch (error) {
    console.error("[TradeTracker] Could not read the local test session.", error);
    return false;
  }
}

export function startLocalAdminTestSession() {
  if (!["localhost", "127.0.0.1", "::1"].includes(window.location.hostname)) {
    throw new Error("The local test login is only available on localhost.");
  }
  try {
    sessionStorage.setItem(LOCAL_ADMIN_TEST_SESSION, "true");
  } catch (error) {
    console.error("[TradeTracker] Could not start the local test session.", error);
    throw new Error("The local test session could not be started because browser session storage is unavailable.");
  }
}

export function endLocalAdminTestSession() {
  try {
    sessionStorage.removeItem(LOCAL_ADMIN_TEST_SESSION);
  } catch (error) {
    console.error("[TradeTracker] Could not end the local test session.", error);
    throw new Error("The local test session could not be ended because browser session storage is unavailable.");
  }
}

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
  if (hasLocalAdminTestSession()) return true;
  const client = await getAuthClient();
  if (!client) return false;

  const { data, error } = await client.auth.getSession();
  if (error) throw error;
  return Boolean(data.session?.user);
}
