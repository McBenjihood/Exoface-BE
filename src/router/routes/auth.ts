import { Router } from "express";
import passport from "passport";
import type { Request, Response } from "express";
import {initUserRegister, createJWT} from "@/services/AuthService.js";

const router = Router();

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
    return await initUserRegister(res, email);
})


export default router;