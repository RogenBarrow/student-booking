<script>

    import { supabase } from '$lib/supabaseClient';
    import { goto } from '$app/navigation';
    import BookingCalender from '$lib/component/BookingCalender.svelte';
    const { data, form } = $props();

    const signOut = async () => {
    await supabase.auth.signOut();
    goto('/');
};


    

</script>

<main class="min-h-screen flex flex-col items-center pt-16 bg-gradient-to-br from-white via-blue-100 to-blue-400 px-5 p-8">
    <div class="w-[min(1100px,95vw)] flex flex-col rounded-3xl overflow-hidden bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_30px_80px_rgba(30,64,175,0.25)] p-8">
       <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-slate-800">Book your time</h1>
        <button onclick={signOut} class="px-4 py-2 rounded-md bg-white/60 text-slate-700 hover:bg-white/80 border border-white/40">Sign out</button>
       </div>
       {#if data.slots.length === 0}
       <p class="text-slate-500 text-center mt-10">No available slots.</p>
   {:else}
       <BookingCalender slots={data.slots} {form} />
   {/if}
 </div>   
</main>