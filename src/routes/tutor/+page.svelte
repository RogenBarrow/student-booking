<script>
    import { enhance } from "$app/forms";
    import { supabase } from '$lib/supabaseClient';
    import { goto } from '$app/navigation';
    
    const { data } = $props();
    const signOut = async () => {
    await supabase.auth.signOut();
    goto('/');
};


</script>

<main class="min-h-screen flex flex-col items-center pt-16 bg-gradient-to-br from-white via-blue-100 to-blue-400 px-5 p-8">
   <div class="w-[min(1100px,95vw)] flex flex-col gap-6 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_30px_80px_rgba(30,64,175,0.25)] p-8">
   
    <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-slate-800" >Admin Dashboard</h1>
        <button class="px-4 py-2 rounded-md bg-white/60 text-slate-700 hover:bg-white/80 border border-white/40" onclick={signOut}>Sign out</button>
    </div>   

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="flex flex-col gap-6">
    <section class="bg-white/50 rounded-xl p-4 flex flex-col">
    <h2 class="text-lg font-semibold text-slate-800 mb-3">Create Booking</h2>
    <form class="flex flex-col gap-3 max-w-sm" method="POST" action="?/createSlot" use:enhance>
            <label for="">Start time</label>
                <input class="px-3 py-2 rounded-md bg-white/70 text-slate-800 border border-blue-200" id="start_time" type="datetime-local" name="start_time">
            <label for="">End time</label>
                <input class="px-3 py-2 rounded-md bg-white/70 text-slate-800 border border-blue-200" id="end_time" type="datetime-local" name="end_time"> 
                <button class="px-4 py-2 rounded-md bg-blue-500 text-white self-start" type="submit">Create Booking</button>
            </form>
        </section>


    <section class="bg-white/50 rounded-xl p-4 flex flex-col">
        <h2 class="text-lg font-semibold text-slate-800 mb-3">Available Booking</h2>
        {#each data.slots as slot }
            <article class="bg-white/70 rounded-lg p-3 flex justify-between items-center mb-2">
                <p class="text-slate-700 font-medium">
                    {new Date(slot.start_time).toLocaleString([], {dateStyle: 'medium', timeStyle: 'short'})}
                    —
                    {new Date(slot.end_time).toLocaleTimeString([], {timeStyle: 'short'})}
                </p>                
            <form method="POST" action="?/deleteSlot" use:enhance>
            <input type="hidden" name="slot_id" value={slot.id}>
            <button class="px-4 py-2 rounded-md bg-red-400 text-white" type="submit">Delete</button>
            </form>
            </article>
            {/each}
        </section>
    </div>
    <section class="bg-white/50 rounded-xl p-4 flex flex-col">
        <h2 class="text-lg font-semibold text-slate-800 mb-3">Upcoming Bookings</h2>
        {#each data.booking as booking }
        <article class="bg-white/70 rounded-lg p-3 flex justify-between items-center mb-2">
        <p>{booking.profiles.display_name ?? 'Unknown student'}</p>
        <p>{new Date(booking.availability_slots?.start_time).toLocaleString()} — {new Date(booking.availability_slots?.end_time).toLocaleString()}</p>
    <form method="POST" action="?/cancelBooking" use:enhance>
        <input type="hidden" name="booking_id" value={booking.id}>
        <button class="px-4 py-2 rounded-md bg-red-400 text-white" type="submit">Cancel booking</button>
    </form>
        </article>
        {/each}
    </section>
</div>

   
    </div>
</main>