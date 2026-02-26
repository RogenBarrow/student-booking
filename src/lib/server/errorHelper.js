


export const toBookingErrorHelper = ( message = '' ) => {
    const lowercaseMessage = String(message ?? '').toLowerCase()

    if (lowercaseMessage.includes('not open') || lowercaseMessage.includes('unique')) {
        return 'This slot is no longer available.'
    }

    return 'Could not complete booking. Please try again.'
};