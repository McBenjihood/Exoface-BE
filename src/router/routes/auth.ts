import { Router } from "express";
import passport from "passport";
import type { Request, Response } from "express";
import { initUserRegister, createJWT, verifyUserRegister } from "@/services/AuthService.js";

const router = Router();

// Regex wurde mit KI generiert, wegem mangelnder Kentnisse in Regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_REGEX = /^\d{6}$/;

router.post("/login", (req: Request, res: Response, next) => {
    passport.authenticate("local", { session: false }, (err: Error | null, user: any, info: any) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ error: info?.message || "Authentifizierung fehlgeschlagen" });
        }

        const token = createJWT(user);
        return res.status(200).json({
            message: "Erfolgreich eingeloggt",
            token: token
        });
    })(req, res, next);
});

router.post("/init-register", async (req: Request, res: Response) => {
    const { email } = req.body;

    if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
        return res.status(400).json({ message: "Ungültige E-Mail-Adresse." });
    }

    return await initUserRegister(res, email.trim().toLowerCase());
});

router.post("/verify-register", async (req: Request, res: Response) => {
    const { email, otp, password } = req.body;

    if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
        return res.status(400).json({ message: "Ungültige E-Mail-Adresse." });
    }
    if (typeof otp !== "string" || !OTP_REGEX.test(otp.trim())) {
        return res.status(400).json({ message: "OTP muss ein 6-stelliger Zahlencode sein." });
    }
    if (typeof password !== "string" || password.length < 8 || password.length > 128) {
        return res.status(400).json({
            message: "Passwort muss zwischen 8 und 128 Zeichen lang sein."
        });
    }

    return await verifyUserRegister(res, email.trim().toLowerCase(), otp.trim(), password);
});

export default router;