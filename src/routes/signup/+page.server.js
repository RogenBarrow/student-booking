import { fail, redirect } from "@sveltejs/kit";

export const actions = {
    default: async ({request, locals, url}) => {
        const form = await request.formData();
        const firstName = String(form.get('first_name') ?? '')
        const lastName = String(form.get('last_name') ?? '');
        const timezone = String(form.get('timezone') ?? '');
        const email = String(form.get('email') ?? '')
        const password = String(form.get('password') ?? '')

        if (!email || !password) {
            return fail(400, { message: 'Email and password are required'})
        }

        const { data, error } = await locals.supabase.auth.signUp({
            email,
            password,
            options: {
                data: { first_name: firstName, last_name: lastName, timezone: timezone },
                emailRedirectTo: `${url.origin}/auth/callback`
            }
        })

        if (error) {
            return fail(400, { message: error.message})
        }

        if (!data.session) {
            return { success: true, message: 'Check your email to confirm your account.' }
        }
        
        const { error: profileError } = await locals.supabase.from('profiles').upsert({
            id: data.user?.id,
            display_name: `${firstName} ${lastName}`.trim() || email,
            timezone: timezone || 'UTC',
            role: 'student',
            email: email
        }, { onConflict: 'id', ignoreDuplicates: true });
        
        if (profileError) {
            console.error('Profile upsert error:', profileError);
            return fail(400, { message: profileError.message });
        }
        
        throw redirect(303, '/book')
        
        


    }
}
