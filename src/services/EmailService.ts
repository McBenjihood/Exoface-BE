import { transporter } from "@/config/mailer.js";

export async function sendLoginEmail(toEmail: string, userName: string, OTP: number) {
    const info = await transporter.sendMail({
        from: `"Dein Name" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: "Hello World Test",
        text: `Hallo ${userName}, Hello World!`,
    });

    console.log("E-Mail erfolgreich gesendet: %s", info.messageId);
    return true;
}