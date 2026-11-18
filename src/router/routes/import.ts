import express, { Router } from "express";
import type { Request, Response } from "express";
import {addProvisionalUser} from "@/services/ImportService.js";
import {authenticateJwt, requireRole} from "@/middleware/authMiddleware.js"
import {findOrCreateClass} from "@/services/ClassesService.js";

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

router.post("/importclasses", requireRole("teacher", "admin"), async (req: Request, res: Response) => {
    try {
        const users = req.body;

        if (!Array.isArray(users)) {
            return res.status(400).json({ error: "Array erwartet" });
        }

        const uniqueClassNames = [...new Set(users.map((u: any) => u.class).filter(Boolean))];
        console.log("F", uniqueClassNames);
        for (const className of uniqueClassNames) {
            await findOrCreateClass(className);
        }

        return res.status(201).json({
            message: `${uniqueClassNames.length} Klassen erfolgreich überprüft/angelegt!`
        });
    } catch (e: any) {
        console.error(e);
        return res.status(500).json({ error: e.message });
    }
});


export default router;