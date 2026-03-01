import { bookingFallback } from "$lib/bookingFallBack.js";
import { toBookingErrorHelper } from "$lib/server/errorHelper.js";
import { requireSession, requireRole } from "$lib/server/auth.js";
import { fail } from "@sveltejs/kit";
import { isUUID } from "$lib/server/uuidValidator.js";


export const load = async ( {locals, url }) => {
    // session management
   await requireSession({ locals });
   

   //read the url parameters
   const start = url.searchParams.get('start');
   const end = url.searchParams.get('end');

   const { startIso, endIso } = bookingFallback({ start, end });

   const { data: slots, error } = await locals.supabase
    .from('availability_slots')
    .select('id, tutor_id, start_time, end_time, status')
    .eq('status', 'open')
    .gte('start_time', startIso)
    .lte('end_time', endIso)
    .order('start_time', { ascending: true });

    if (error) {
        return { slots: [], message: toBookingErrorHelper(error.message) };
    }

    return { slots: slots ?? [], start: startIso, end: endIso};

};

export const actions = {

    book: async ({ request, locals }) => {
        await requireRole({ locals, role: 'student' });
        
        const form = await request.formData();
        const slotId = String(form.get('slot_id') ?? '');
        const isUUIDValidated = isUUID(slotId)

        if (!isUUIDValidated) {
            return fail(400, { message: 'Invalid slot id.'});
        }

        const { error } = await locals.supabase.rpc('book_slot', {
            p_slot_id: slotId
        });

        if (error) {
            return fail(400, { message: toBookingErrorHelper(error.message)});
        }

        return { success: true, message: 'Booking confirmed' };

    }

};
