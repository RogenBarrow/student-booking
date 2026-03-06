<script>
  import { supabase } from '$lib/supabaseClient';
  import { goto } from '$app/navigation';

  let email = $state('');
  let password = $state('');
  let errorMessage = $state('');
  let loading = $state(false);

  const signIn = async () => {
    errorMessage = '';
    loading = true;
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
        loading = false;
        errorMessage = err.message;
        return;
    }
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .single();
    loading = false;
    goto(profile?.role === 'tutor' ? '/tutor' : '/book');
};


  const signInWithGoogle = async () => {
    errorMessage = '';
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (err) errorMessage = err.message;
  };
</script>

<button type="button" onclick={signInWithGoogle}>Sign in with Google</button>
