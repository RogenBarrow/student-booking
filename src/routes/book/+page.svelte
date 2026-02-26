<script>

    const { data, form } = $props();

    

</script>

<main>
    <p>Open Slots: { data.slots.length }</p>
    {#if form?.message}
        <p>{ form.message }</p>
    {/if}
    {#if data.slots.length === 0}
    <p>No available slots.</p>
    {:else}
    <div>
        {#each data.slots as slot }
        <article>
            <p>Start: {new Date(slot.start_time).toLocaleString()}</p>
            <p>End: {new Date(slot.end_time).toLocaleString()}</p>
            <form method="POST" action="?/book">
                <button type="submit" name="slot_id" value={slot.id}>Book slot</button>
            </form>
        </article>
        {/each}
    </div>
   {/if}
</main>