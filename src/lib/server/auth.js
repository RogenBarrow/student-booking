import { error, redirect } from "@sveltejs/kit";

/**
 * @param {{ locals: App.Locals }} params
 * @returns {Promise<import('@supabase/supabase-js').Session | null>}
 */
export const getSessionOrNull = async ({ locals }) => {
   
   const session = await locals.getSession();
   if (!session) return null;

   return session;

};

/**
 * @param {{ locals: App.Locals }} params
 * @returns {Promise<import('@supabase/supabase-js').Session>}
 */
export const requireSession = async ({ locals }) => {
  
   const session = await getSessionOrNull({ locals });
   if (!session) throw redirect (303, '/');

   return session;

};

/**
 * @param {{ locals: App.Locals, role: 'student' | 'tutor' }} params
 * @returns {Promise<{ session: import('@supabase/supabase-js').Session, profile: { id: string, role: 'student' | 'tutor' } }>}
 */
export const requireRole = async ({ locals, role }) => {
   const session = await requireSession({ locals });
 
   const { data: profile, error: profileError } = await locals.supabase
     .from('profiles')
     .select('id, role')
     .eq('id', session.user.id)
     .single();
 
   if (profileError || !profile) throw error(403, 'Profile not found');
   if (profile.role !== role) throw error(403, 'Forbidden');
 
   return { session, profile };
 };

