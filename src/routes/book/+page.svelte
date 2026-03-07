<script>

    import { supabase } from '$lib/supabaseClient';
    import { goto } from '$app/navigation';
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
        <p class="text-slate-600 text-sm mb-4">Open Slots: { data.slots.length }</p>
    {#if form?.message}
        <p>{ form.message }</p>
    {/if}
    {#if data.slots.length === 0}
    <p class="text-slate-500 text-center mt-10">No available slots.</p>
    {:else}
    <div>
        {#each data.slots as slot }
        <article class="bg-white/50 rounded-xl p-4 flex justify-between items-center mb-3">
            <p>{new Date(slot.start_time).toLocaleString([], {dateStyle: 'medium', timeStyle: 'short'})} — {new Date(slot.end_time).toLocaleTimeString([], {timeStyle: 'short'})}</p>
            <form method="POST" action="?/book">
                <button type="submit" name="slot_id" value={slot.id} class="px-4 py-2 rounded-md bg-blue-500 text-white">Book slot</button>
            </form>
        </article>
        {/each}
    </div>
   {/if}
</div>
</main>