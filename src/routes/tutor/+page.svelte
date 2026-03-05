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
            <p>{slot.start_time}</p>
            <p>{slot.end_time}</p>
            <form method="POST" action="?/deleteSlot" use:enhance>
            <input type="hidden" name="slot_id" value={slot.id}>
            <button type="submit">Delete</button>
            </form>
        {/each}
    </section>

    <section>
        {#each data.booking as booking }
        <p>{booking.profiles[0]?.display_name ?? 'Unknown student'}</p>
        <p>{booking.slot_id}</p>
        {/each}
    </section>
</main>