import nodemailer from 'nodemailer';

import { env } from "$env/dynamic/private";

const transporter = nodemailer.createTransport({
    host: env.MAILTRAP_HOST,
    port: Number(env.MAILTRAP_PORT),
    auth: { user: env.MAILTRAP_USER, pass: env.MAILTRAP_PASS}
});

export const sendCancellationEmail = async ({ to, subject, text }) => {

    return transporter.sendMail({ from: env.MAILTRAP_FROM, to, subject, text, 
        html: `
        <div style="font-family: sans-serif; background: linear-gradient(135deg, #ffffff, #dbeafe, #60a5fa); padding: 40px; min-height: 100vh;">
            <div style="max-width: 500px; margin: 0 auto; background: rgba(255,255,255,0.7); border-radius: 24px; padding: 32px; box-shadow: 0 20px 60px rgba(30,64,175,0.2);">
                <h1 style="color:rgb(255, 60, 60); font-size: 24px; margin-bottom: 8px;">Booking Cancelled</h1>
                <p style="color:rgb(255, 60, 60); font-size: 16px;">Your session has been cancelled successfully.</p>
                <div style="background: rgba(255,255,255,0.8); border-radius: 12px; padding: 16px; margin: 24px 0; border: 1px solid #fecaca;">
                    <p style="color: #dc2626; font-weight: 600; margin: 0;">${text}</p>
                </div>
                <p style="color: #dc2626; font-size: 14px;">Feel free to book another session.</p>
            </div>
        </div>
    `
    
    });
}

export const sendConfirmationEmail = async ({ to, startTime, endTime}) => {
    return transporter.sendMail({
        from: env.MAILTRAP_FROM,
        to,
        subject: 'Booking Confirmed.',
        text: `Your booking has been confirmed from ${startTime} to ${endTime}.`,
        html: `
        <div style="font-family: sans-serif; background: linear-gradient(135deg, #ffffff, #dbeafe, #60a5fa); padding: 40px; min-height: 100vh;">
            <div style="max-width: 500px; margin: 0 auto; background: rgba(255,255,255,0.7); border-radius: 24px; padding: 32px; box-shadow: 0 20px 60px rgba(30,64,175,0.2);">
                <h1 style="color: #1e3a8a; font-size: 24px; margin-bottom: 8px;">Booking Confirmed</h1>
                <p style="color: #475569; font-size: 16px;">Your session has been booked successfully.</p>
                <div style="background: rgba(255,255,255,0.8); border-radius: 12px; padding: 16px; margin: 24px 0; border: 1px solid #bfdbfe;">
                    <p style="color: #1e40af; font-weight: 600; margin: 0;">${startTime} — ${endTime}</p>
                </div>
                <p style="color: #64748b; font-size: 14px;">See you then!</p>
            </div>
        </div>
    `
    });
}