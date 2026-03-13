import nodemailer from 'nodemailer';

import { MAILTRAP_HOST, MAILTRAP_PORT, MAILTRAP_USER, MAILTRAP_FROM, MAILTRAP_PASS } from "$env/static/private";

const transporter = nodemailer.createTransport({
    host: MAILTRAP_HOST,
    port: Number(MAILTRAP_PORT),
    auth: { user: MAILTRAP_USER, pass: MAILTRAP_PASS}
});

export const sendCancellationEmail = async ({ to, subject, text }) => {

    return transporter.sendMail({ from: MAILTRAP_FROM, to, subject, text}); 
} 

export const sendConfirmationEmail = async ({ to, startTime, endTime}) => {
    return transporter.sendMail({ 
        from: MAILTRAP_FROM, 
        to, 
        subject: 'Booking Confirmed.', 
        text: `Your booking has been confirmed from ${startTime} to ${endTime}.`
    });
}