<script>
  import { enhance } from '$app/forms';
  const { form } = $props();

  let timezone = $state('');
  $effect(() => {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  
</script>

<main class="min-h-screen grid place-items-center bg-gradient-to-br from-white via-blue.100 to-blue-300 px-5">
    <div class="w-[min(1100px,85vw)] min-h-[640px] grid grid-cols-[1.1fr_1fr] rounded-3xl overflow-hidden bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_30px_80px_rgba(30,64,175,0.25)]">
    <section class="relative p-7 bg-white/20">
        <div class="absolute inset-0 bg-white/60"></div>
        <div class="relative z-10 text-slate-800">
            <h2 class="mt-20 justify-center font-extrabold text-center text-9xl front-semibold text-blue-300">Let's get you started</h2>
        </div>
    </section>

    <section class="p-12 bg-white/70 backdrop-blur-md text-slate-900">
        <form method="POST" use:enhance class="flex flex-col gap-3 w-full max-w-sm mt-15">
            <label class="text-sm font-medium text-slate-700" for="first_name">First Name</label>
            <input class="w-full px-3 py-2 rounded bg-white/70 text-black border border-blue-200 rounded-md" type="text" id="first_name" name="first_name" placeholder="First name" required/>
            <label class="text-sm font-medium text-slate-700" for="last_name">Last Name</label>
            <input class="w-full px-3 py-2 rounded bg-white/70 text-black border border-blue-200 rounded-md"type="text" id="last_name" name="last_name" placeholder="Last name" required/>
            <label class="text-sm font-medium text-slate-700" for="email">Email</label>
            <input class="w-full px-3 py-2 rounded bg-white/70 text-black border border-blue-200 rounded-md" type="email"  name="email" id="email" placeholder="Email required" required/>
            <label class="text-sm font-medium text-slate-700" for="password">Password</label>
            <input class="w-full px-3 py-2 rounded bg-white/70 text-black border border-blue-200 rounded-md" type="password" id="password" name="password" placeholder="Password required" required/>
            <input type="hidden" name="timezone" bind:value={timezone}>
            <button class="w-full py-2.5 rounded-md bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed" type="submit">Create account</button>
        </form>
        {#if form?.message}
          <p class="mt-3 text-sm text-blue-700">{form.message}</p>
        {/if}

    </section>

    </div>
</main>
