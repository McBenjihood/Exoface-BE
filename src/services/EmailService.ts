import { transporter } from "@/config/mailer.js";

export async function sendLoginEmail(toEmail: string, userName: string, OTP: number) {
    const info = await transporter.sendMail({
        from: `"Exoface" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: "Dein Anmeldecode für Exoface",
        text:
            `Hallo ${userName}\n\n` +
            `Dein Code für die Anmeldung bei Exoface lautet: ${OTP}\n\n` +
            `Der Code ist 10 Minuten gültig.\n` +
            `Falls du dich nicht anmelden wolltest, kannst du diese E-Mail ignorieren.`,
        html: `
            <div style="background-color:#f4f7f9; padding:32px 16px; font-family:Arial, sans-serif; color:#12242e;">
                <div style="max-width:480px; margin:0 auto; padding:32px; background-color:#ffffff; border:1px solid #dde5ea; border-radius:8px;">
                    <img src="cid:exoface-logo" alt="Exoface" width="140" style="display:block; margin:0 0 24px; border:0;">

                    <p style="margin:0 0 12px; font-size:15px;">Hallo ${userName}</p>
                    <p style="margin:0 0 12px; font-size:15px;">Hier ist dein Code für die Anmeldung bei Exoface:</p>

                    <div style="margin:24px 0; padding:16px; text-align:center; font-size:32px; font-weight:bold; letter-spacing:8px; background-color:#f4f7f9; border:1px solid #dde5ea; border-radius:6px;">
                        ${OTP}
                    </div>

                    <p style="margin:0 0 8px; font-size:14px; color:#5a6b77;">Der Code ist 10 Minuten gültig.</p>
                    <p style="margin:0; font-size:14px; color:#5a6b77;">Falls du dich nicht anmelden wolltest, kannst du diese E-Mail ignorieren.</p>
                </div>
            </div>
        `,
        attachments: [
            {
                filename: "logo.png",
                path: "assets/logo.png",
                cid: "exoface-logo",
            },
        ],
    });

    console.log("E-Mail erfolgreich gesendet: %s", info.messageId);
    return true;
}