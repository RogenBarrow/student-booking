<script>
    import { Calendar } from 'bits-ui';
    import { today, getLocalTimeZone } from '@internationalized/date';

    const { slots, form } = $props();

    let selectedDate = $state(today(getLocalTimeZone()));

    const slotDates = new Set(
        slots.map(slot => {
            const d = new Date(slot.start_time);
            return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        })
    );

    const selectedSlots = $derived(
        slots.filter(slot => {
            const d = new Date(slot.start_time);
            return d.getFullYear() === selectedDate?.year &&
                   d.getMonth() + 1 === selectedDate?.month &&
                   d.getDate() === selectedDate?.day;
        })
    );

    const isDateUnavailable = (date) => {
        return !slotDates.has(`${date.year}-${date.month}-${date.day}`);
    };
</script>

<div class="flex gap-8 flex-col lg:flex-row">

    <!-- Calendar -->
    <div class="flex-1">
        <Calendar.Root bind:value={selectedDate} {isDateUnavailable}>
            {#snippet children({ months, weekdays })}
                <Calendar.Header class="flex items-center justify-between mb-4">
                    <Calendar.PrevButton class="px-2 py-1 rounded hover:bg-white/40 text-slate-700 text-lg">‹</Calendar.PrevButton>
                    <Calendar.Heading class="font-semibold text-slate-800" />
                    <Calendar.NextButton class="px-2 py-1 rounded hover:bg-white/40 text-slate-700 text-lg">›</Calendar.NextButton>
                </Calendar.Header>
                {#each months as month}
                    <Calendar.Grid class="w-full">
                        <Calendar.GridHead>
                            <Calendar.GridRow class="flex">
                                {#each weekdays as day}
                                    <Calendar.HeadCell class="flex-1 text-center text-xs text-slate-500 pb-2">
                                        {day.slice(0, 2)}
                                    </Calendar.HeadCell>
                                {/each}
                            </Calendar.GridRow>
                        </Calendar.GridHead>
                        <Calendar.GridBody>
                            {#each month.weeks as weekDates}
                                <Calendar.GridRow class="flex">
                                    {#each weekDates as date}
                                        <Calendar.Cell {date} month={month.value} class="flex-1 p-1 text-center">
                                            <Calendar.Day class="w-full aspect-square rounded-full flex items-center justify-center text-sm
                                                data-[selected]:bg-blue-500 data-[selected]:text-white
                                                data-[unavailable]:text-slate-300 data-[unavailable]:pointer-events-none
                                                hover:bg-blue-100 cursor-pointer transition-colors" />
                                        </Calendar.Cell>
                                    {/each}
                                </Calendar.GridRow>
                            {/each}
                        </Calendar.GridBody>
                    </Calendar.Grid>
                {/each}
            {/snippet}
        </Calendar.Root>
    </div>

    <!-- Slots for selected day -->
    <div class="flex-1">
        {#if form?.message}
            <p class="text-red-500 text-sm mb-4">{form.message}</p>
        {/if}
        {#if selectedSlots.length === 0}
            <p class="text-slate-500 text-center mt-10">No slots available for this day.</p>
        {:else}
            {#each selectedSlots as slot}
                <article class="bg-white/50 rounded-xl p-4 flex justify-between items-center mb-3">
                    <p class="text-slate-700 font-medium">
                        {new Date(slot.start_time).toLocaleTimeString([], {timeStyle: 'short'})} — {new Date(slot.end_time).toLocaleTimeString([], {timeStyle: 'short'})}
                    </p>
                    <form method="POST" action="?/book">
                        <button type="submit" name="slot_id" value={slot.id} class="px-4 py-2 rounded-md bg-blue-500 text-white">Book</button>
                    </form>
                </article>
            {/each}
        {/if}
    </div>

</div>

