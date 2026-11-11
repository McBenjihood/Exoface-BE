import { Router } from "express";
import type { Request, Response } from "express";
import { createVm, ServiceError } from "@/services/VmService.js";
import {authenticateJwt, requireRole} from "@/middleware/authMiddleware.js";

const router = Router();

router.use(authenticateJwt);

router.post("/create", requireRole("teacher", "admin"), async (req: Request, res: Response) => {
    try {
        const { targetUserId, name, templateId, instanceTypeId, diskSize } = req.body;

        if (!targetUserId || typeof targetUserId !== "number") {
            return res.status(400).json({ error: "Ein gültiger 'recipientUserId' (Zahl) ist erforderlich." });
        }

        if (!name || typeof name !== "string" || name.trim().length === 0) {
            return res.status(400).json({ error: "Ein gültiger Name ist erforderlich." });
        }

        if (name.length > 50) {
            return res.status(400).json({ error: "Der Name darf nicht länger als 50 Zeichen lang sein." });
        }

        if (diskSize !== undefined && (typeof diskSize !== "number" || diskSize < 10 || diskSize > 500)) {
            return res.status(400).json({ error: "Disksize muss zwischen 10 und 500 GB liegen." });
        }

        const vm = await createVm({
            targetUserId: targetUserId,
            name: name.trim(),
            templateId,
            instanceTypeId,
            diskSize
        });

        return res.status(201).json({
            message: "VM erfolgreich erstellt",
            vm
        });
    } catch (error: any) {
        if (error instanceof ServiceError) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error("Unhandled error in POST /api/vms:", error);
        return res.status(500).json({ error: "Ein interner Serverfehler ist aufgetreten." });
    }
});

export default router;