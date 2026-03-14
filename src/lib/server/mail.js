import nodemailer from 'nodemailer';

import { env } from "$env/dynamic/private";

const transporter = nodemailer.createTransport({
    host: env.MAILTRAP_HOST,
    port: Number(env.MAILTRAP_PORT),
    auth: { user: env.MAILTRAP_USER, pass: env.MAILTRAP_PASS}
});

export const sendCancellationEmail = async ({ to, subject, text }) => {

    return transporter.sendMail({ from: env.MAILTRAP_FROM, to, subject, text});
}

export const sendConfirmationEmail = async ({ to, startTime, endTime}) => {
    return transporter.sendMail({
        from: env.MAILTRAP_FROM,
        to,
        subject: 'Booking Confirmed.',
        text: `Your booking has been confirmed from ${startTime} to ${endTime}.`
    });
}