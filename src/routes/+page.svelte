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
      loading = false;
      if (err) {
        errorMessage = err.message;
        return;
      }
      goto('/calendar');
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
  
  <button type="button" on:click={signInWithGoogle}>Sign in with Google</button>
  