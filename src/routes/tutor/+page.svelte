<script>
    import { enhance } from "$app/forms";
    const { data } = $props();


</script>

<main>
    <section>
        <form method="POST" action="?/createSlot" use:enhance>
            <input id="start_time" type="datetime-local" name="start_time">
            <input id="end_time" type="datetime-local" name="end_time"> 
            <button type="submit">Create Booking</button>
        </form>
    </section>

    <section>
        {#each data.slots as slot }
            <p>{new Date(slot.start_time).toLocaleString()}</p>
            <p>{new Date(slot.end_time).toLocaleString()}</p>
            <form method="POST" action="?/deleteSlot" use:enhance>
            <input type="hidden" name="slot_id" value={slot.id}>
            <button type="submit">Delete</button>
            </form>
        {/each}
    </section>

    <section>
        {#each data.booking as booking }
        <p>{booking.profiles.display_name ?? 'Unknown student'}</p>
        <p>{new Date(booking.availability_slots?.start_time).toLocaleString()} — {new Date(booking.availability_slots?.end_time).toLocaleString()}</p>
    <form method="POST" action="?/cancelBooking" use:enhance>
        <input type="hidden" name="booking_id" value={booking.id}>
        <button type="submit">Cancel booking</button>
    </form>
        {/each}
    </section>
</main>