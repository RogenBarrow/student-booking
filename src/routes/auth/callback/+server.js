import { redirect } from '@sveltejs/kit';

export const GET = async ({ url, locals }) => {
  const code = url.searchParams.get('code');
  if (code) {
    await locals.supabase.auth.exchangeCodeForSession(code);
    const { data: { user } } = await locals.supabase.auth.getUser();
    await locals.supabase.from('profiles').upsert({ id: user?.id, display_name: `${user?.user_metadata.first_name ?? ''} ${user?.user_metadata.last_name ?? ''}`.trim() || user?.email, timezone: user?.user_metadata.timezone || 'UTC', role: 'student', email: user?.email}, {onConflict: 'id', ignoreDuplicates: true});
    const { data: profile } = await locals.supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id)
    .single();

  throw redirect(303, profile?.role === 'tutor' ? '/tutor' : '/book');

  }

  throw redirect(303, '/book');
  
};
