<script>
  import { supabase } from '$lib/supabaseClient';
  import { goto } from '$app/navigation';

  let email = $state('');
  let password = $state('');
  let errorMessage = $state('');
  let loading = $state(false);

  const signIn = async () => {
    event?.preventDefault();
    errorMessage = '';
    loading = true;
    const { data: { user }, error: err } = await supabase.auth.signInWithPassword({ email, password });
    loading = false;
    if (err) {
      errorMessage = err.message;
      return;
    }
    const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id)
    .single();
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

<main class="min-h-screen grid place-items-center bg-gradient-to-br from-white via-blue-100 to-blue-400 px-5">
  <div class="w-[min(1100px,95vw)] min-h-[640px] grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] rounded-3xl overflow-hidden bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_30px_80px_rgba(30,64,175,0.25)]">
    <section
      class="relative p-7 text-slate-900 bg-white/20 backdrop-blur-md"
      style="background-image: url('/auth-hero.jpg'); background-size: cover; background-position: center;"
    >
      <!-- left panel -->
    </section>

    <section class="p-12 bg-white/70 backdrop-blur-md text-slate-900">
      <form class="flex flex-col gap-3 w-full max-w-sm mt-30" onsubmit={signIn}>
        <label for="email">Email</label>
        <input
          id="email"
          class="w-full px-3 py-2 rounded bg-white-400 text-black border border-blue-500 rounded-md"
          type="email"
          name="email"
          placeholder="Enter your email"
          bind:value={email}
        />
        <label for="password">Password</label>
        <input
          id="password"
          class="w-full px-3 py-2 rounded bg-white-400 text-black border border-blue-500 rounded-md"
          type="password"
          name="password"
          placeholder="Enter your password"
          bind:value={password}
        />
        <div class="w-full max-w-sm flex flex-col gap-3">
        <button class="w-full py-2.5 rounded-md bg-blue-500 text-white" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        {#if errorMessage}
          <p class="text-sm text-red-300">{errorMessage}</p>
        {/if}
        <button class="w-full py-2.5 rounded-md bg-blue-500 text-white" type="button" onclick={signInWithGoogle}>
          Sign in with Google
        </button>
        <a href="/signup" class="text-sm text-blue-500">First time? Sign up</a>
      </div>
      </form>

    </section>
  </div>
</main>
