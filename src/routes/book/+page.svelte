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
       {#if form?.success}
            <p class="bg-green-100 text-green-700 border border-green-300 rounded-lg px-4 py-3 mb-4">
                 {form.message}
            </p>
        {/if}

       {#if data.slots.length === 0}
       <p class="text-slate-500 text-center mt-10">No available slots.</p>
   {:else}
       <BookingCalender slots={data.slots} {form} />
   {/if}
   <section class="bg-white/50 rounded-xl p-4 flex flex-col mt-6">
    <h2 class="text-lg font-semibold text-slate-800 mb-3">My Upcoming Bookings</h2>
    {#if data.bookings.length === 0}
        <p class="text-slate-500 text-center mt-4">No upcoming bookings.</p>
    {:else}
        {#each data.bookings as booking}
        <article class="bg-white/70 rounded-lg p-3 flex justify-between items-center mb-2">
            <p class="text-slate-700 font-medium">
                {new Date(booking.availability_slots?.start_time).toLocaleString([], {dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC'})}
                —
                {new Date(booking.availability_slots?.end_time).toLocaleTimeString([], {timeStyle: 'short', timeZone: 'UTC'})}
            </p>
            <span class="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-600">Booked</span>
        </article>
        
        {/each}
    {/if}
</section>

 </div>   
</main>