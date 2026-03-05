import { requireRole } from '$lib/server/auth';
import { toBookingErrorHelper } from '$lib/server/errorHelper';
import { isUUID } from '$lib/server/uuidValidator.js';
import { fail } from '@sveltejs/kit';



export const load = async ( {locals }) => {
   
    const { profile } = await requireRole({ locals, role: 'tutor' });

    const { data: slots, error } = await locals.supabase
    .from('availability_slots')
    .select('id, tutor_id, start_time, end_time, status')
    .eq('tutor_id', profile.id)
    .order('start_time', { ascending: true });

    if (error) {
        return { slots: [], message: toBookingErrorHelper(error.message) };
    }

    const { data: booking, error: bookingError } = await locals.supabase
    .from('bookings')
    .select('id, slot_id, status, profiles!bookings_student_id_fkey(display_name)')
    .eq('tutor_id', profile.id)
    .eq('status', 'booked')

    if (bookingError) {
        return { slots: [], message: toBookingErrorHelper(bookingError.message) };
    }

   return { slots: slots, booking: booking}

};

export const actions = {

    createSlot: async ({ request, locals}) => {

        const { profile } = await requireRole({ locals, role: 'tutor' });

        const form = await request.formData();
        const startTime = String(form.get('start_time') ?? '');
        const endTime = String(form.get('end_time') ?? '');

        if (!startTime || !endTime) {
            return fail(400, { message: 'Start time and end time are required.' })
        }

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

        }
}