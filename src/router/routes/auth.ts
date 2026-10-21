import { Router } from "express";
import type { Request, Response } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", (req: Request, res: Response, next) => {
    passport.authenticate("local", { session: false }, (err: Error | null, user: any, info: any) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ error: info?.message || "Authentifizierung fehlgeschlagen" });
        }

        const token = jwt.sign(
            { id: user.userId, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Erfolgreich eingeloggt",
            token: token
        });
    })(req, res, next);
});



export default router;