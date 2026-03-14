import { requireRole } from '$lib/server/auth';
import { toBookingErrorHelper } from '$lib/server/errorHelper';
import { sendCancellationEmail } from '$lib/server/mail.js';
import { isUUID } from '$lib/server/uuidValidator.js';
import { fail } from '@sveltejs/kit';



export const load = async ( {locals }) => {
   
    const { profile } = await requireRole({ locals, role: 'tutor' });

    const { data: slots, error } = await locals.supabase
    .from('availability_slots')
    .select('id, tutor_id, start_time, end_time, status')
    .eq('tutor_id', profile.id)
    .eq('status', 'open')
    .order('start_time', { ascending: true });

    if (error) {
        return { slots: [], booking: [], message: toBookingErrorHelper(error.message) };
    }

    const { data: booking, error: bookingError } = await locals.supabase
    .from('bookings')
    .select('id, slot_id, status, profiles!bookings_student_id_fkey(display_name, email), availability_slots(start_time, end_time)')
    .eq('tutor_id', profile.id)
    .neq('status', 'cancelled')

    if (bookingError) {
        return { slots: [], booking: [], message: toBookingErrorHelper(bookingError.message) };
    }    

   return { slots: slots, booking: booking}

};

export const actions = {

    createSlot: async ({ request, locals}) => {

        const { profile } = await requireRole({ locals, role: 'tutor' });

        const form = await request.formData();
        const startTime = String(form.get('start_time') ?? '');
        const duration = Number(form.get('duration') ?? 0);

        if (!startTime || !duration) {
         return fail(400, { message: 'Start time and duration are required.' })
        }

        const start = new Date(startTime + ':00Z');
        const end = new Date(start.getTime() + duration * 60 * 1000);
        const endTime = end.toISOString();


        const { error } = await locals.supabase
            .from('availability_slots')
            .insert({ tutor_id: profile.id, start_time: startTime, end_time: endTime, status: 'open'})
            
            if (error) {
                return fail(400, { message: toBookingErrorHelper(error.message)})
            }

            return { success: true };

            
            
        },

        deleteSlot: async ({ request, locals }) => {
            const { profile } = await requireRole({ locals, role: 'tutor' });
            const form = await request.formData();

            const slotID = String(form.get('slot_id'))
            const isUUIDValidated = isUUID(slotID)

            if (!isUUIDValidated) {
                return fail(400, { message: 'Invalid slot id.'});
            }

            const { error } = await locals.supabase
            .from('availability_slots')
            .delete()
            .eq('id', slotID)
            .eq('tutor_id', profile.id)

            if (error) {
                if (error.message.includes('violates foreign key constraint')) {
                    return fail(400, { message: 'Cannot delete a slot that has already has been booked.' })
                }
                return fail(400, { message: toBookingErrorHelper(error.message)})
            }

            return { success: true };

        },

        cancelBooking: async ({ request, locals }) => {

            await requireRole({ locals, role: 'tutor'});
            const form = await request.formData();

            const bookingID = String(form.get('booking_id'));
            const isUUIDValidated = isUUID(bookingID);

            if (!isUUIDValidated) {
                return fail(400, { message: 'Invalid booking id.'});
            }

            const { data: booking, error } = await locals.supabase
            .from('bookings')
            .select('id, profiles!bookings_student_id_fkey(email, display_name), availability_slots(start_time, end_time)')
            .eq('id', bookingID)
            .single()

            if (error) {
                return fail(400, { message: toBookingErrorHelper(error.message)})
            }

                
            const { error: rpcError } = await locals.supabase.rpc('cancel_booking', { p_booking_id: bookingID });
                if (rpcError) {
                    return fail(400, { message: toBookingErrorHelper(rpcError.message) });
            }

            await sendCancellationEmail({
                // @ts-ignore
                to: booking.profiles?.email,
                subject: 'Your booking has been cancelled',
                 // @ts-ignore
                text: `Your booking from ${booking.availability_slots?.start_time} to ${booking.availability_slots?.end_time} has been cancelled.`

            })

            return { success: true };

            }}