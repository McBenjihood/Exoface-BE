import passport from "passport";
import type { Request, Response, NextFunction } from "express";
import UserEntity from "@/models/entities/UserEntity.js";

declare global {
    namespace Express {
        interface User extends UserEntity {}
    }
}

export const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("jwt", { session: false }, (err: any, user: UserEntity | false, info: any) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).json({
                error: info?.message || "Zugriff verweigert: Ungültiger oder fehlender Token."
            });
        }

        req.user = user;
        next();
    })(req, res, next);
};

export const requireRole = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: "Nicht authentifiziert." });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: "Zugriff verweigert: Fehlende Berechtigungen."
            });
        }

        next();
    };
};