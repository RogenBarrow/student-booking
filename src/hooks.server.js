import { createServerClient } from '@supabase/ssr';
import { env } from '$env/dynamic/public';

export const handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(
    env.PUBLIC_SUPABASE_URL,
    env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => event.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            event.cookies.set(name, value, { ...options, path: '/' });
          });
        }
      }
    }
  );

  event.locals.getSession = async () => {
    const { data: sessionData } = await event.locals.supabase.auth.getSession();
    const session = sessionData.session;

    if (!session) return null;

    // Validate the cookie-backed session against Supabase Auth.
    const { data: userData, error } = await event.locals.supabase.auth.getUser();
    if (error || !userData.user) return null;

    return { ...session, user: userData.user };
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name == 'content-range';
    }
  });
};
