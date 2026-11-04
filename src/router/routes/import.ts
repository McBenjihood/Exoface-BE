import express, { Router } from "express";
import type { Request, Response } from "express";
import {addProvisionalUser} from "@/services/ImportService.js";
import {authenticateJwt, requireRole} from "@/middleware/authMiddleware.js"

const router = Router();

router.use(authenticateJwt);
router.post("/importusers",requireRole("teacher", "admin"), (req: Request, res: Response) => {
    try {
        const users = req.body;

        if (!Array.isArray(users)) {
        }

        for (const userData of users) {
             addProvisionalUser(
                userData.name,
                userData.surname,
                userData.email,
                userData.class,
                userData.role
            );
        }

        res.status(201).json({ message: `${users.length} provisional users erfolgreich importiert!` });
    } catch (e) {
        console.error(e);

    }
});

export default router;