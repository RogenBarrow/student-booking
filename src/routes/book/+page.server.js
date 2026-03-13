import { bookingFallback } from "$lib/bookingFallBack.js";
import { toBookingErrorHelper } from "$lib/server/errorHelper.js";
import { requireRole } from "$lib/server/auth.js";
import { fail } from "@sveltejs/kit";
import { isUUID } from "$lib/server/uuidValidator.js";
import { sendConfirmationEmail } from "$lib/server/mail.js";


export const load = async ( {locals, url }) => {
    // session management
  const { profile } = await requireRole({ locals, role: 'student'});
   

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

    const { data: bookings, error: bookingError } = await locals.supabase
    .from('bookings')
    .select('id, status, availability_slots(start_time, end_time)')
    .eq('student_id', profile.id)
    .neq('status', 'cancelled')
    .order('created_at', { ascending: false });

    if (bookingError) {
        return { slots: [], message: toBookingErrorHelper(bookingError.message) };
    }


    return { slots: slots ?? [], bookings: bookings ?? [], start: startIso, end: endIso };


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

        const {data: slot} = await locals.supabase
        .from('availability_slots')
        .select('start_time, end_time')
        .eq('id', slotId).single()

        const { error } = await locals.supabase.rpc('book_slot', {
            p_slot_id: slotId
        });

        if (error) {
            return fail(400, { message: toBookingErrorHelper(error.message)});
        }

        const { data: {user} } = await locals.supabase.auth.getUser()


        await sendConfirmationEmail({ 
        to: user?.email,
        startTime: new Date(slot?.start_time).toLocaleString([], {dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC'}),
        endTime: new Date(slot?.end_time).toLocaleTimeString([], {timeStyle: 'short', timeZone: 'UTC'})
})


        return { success: true, message: 'Booking confirmed' };

    }

};
