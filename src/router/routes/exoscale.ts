import { Router } from "express";
import type { Request, Response } from "express";
import {createVm, getInstanceTypes, getTemplates, getVmList, resetVm, startVm, stopVm} from "@/services/VmService.js";
import {authenticateJwt, requireRole} from "@/middleware/authMiddleware.js";
import {ServiceError} from "@/errors/ServiceError.js";
import {exoscaleClient} from "@/services/VmService.js";

const router = Router();

router.use(authenticateJwt);
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

router.get("/types", requireRole("teacher", "admin"), async (req: Request, res: Response) => {
    try {
        const types = await getInstanceTypes();
        return res.status(200).json({
            instanceTypes: types
        });
    } catch (error: any) {
        if (error instanceof ServiceError) {
            return res.status(error.status).json({ error: error.message });
        }

        console.error("Unhandled error in GET /api/vms/types:", error);
        return res.status(500).json({ error: "Ein interner Serverfehler ist aufgetreten." });
    }
});

router.get("/templates", requireRole("teacher", "admin"), async (req: Request, res: Response) => {
    try {
        const templates = await getTemplates();
        return res.status(200).json({ templates });
    } catch (error: any) {
        if (error instanceof ServiceError) {
            return res.status(error.status).json({ error: error.message });
        }

        console.error("Unhandled error in GET /api/vms/templates:", error);
        return res.status(500).json({ error: "Ein interner Serverfehler ist aufgetreten." });
    }
});

router.post("/create", requireRole("teacher", "admin"), async (req: Request, res: Response) => {
    try {
        const { targetUserId, name, templateId, instanceTypeId, diskSize } = req.body;

        if (!targetUserId || typeof targetUserId !== "number") {
            return res.status(400).json({ error: "Ein gültiger Empfänger ist erforderlich." });
        }

        if (!name || typeof name !== "string" || name.trim().length === 0) {
            return res.status(400).json({ error: "Ein gültiger Name ist erforderlich." });
        }

        if (name.length > 50) {
            return res.status(400).json({ error: "Der Name darf nicht länger als 50 Zeichen lang sein." });
        }

        if (templateId && !UUID_REGEX.test(templateId)) {
            return res.status(400).json({ error: "Ungültiges Format fürs Template." });
        }

        if (instanceTypeId && !UUID_REGEX.test(instanceTypeId)) {
            return res.status(400).json({ error: "Ungültiges Format für den Instanz Typ." });
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


router.get("/vms", requireRole("teacher", "admin"), async (req: Request, res: Response) => {
    try {
        const vms = await getVmList();
        return res.status(200).json({ vms });
    } catch (error: any) {
        console.error("Unhandled error in GET /api/exoscale/vms:", error);
        return res.status(500).json({ error: "Ein interner Serverfehler ist aufgetreten." });
    }
});

router.post("/reset", async (req: Request, res: Response) => {
    const {id, diskSize, template} = req.body;

    try {
        const op = await resetVm(id, diskSize, template);
        return res.status(200).json({
            operationId : op.id,
            message : "Vm was reset is in progress."
        });
    }catch (error: any){
        console.error("Unhandled error in POST /api/exoscale/reset", error);
        return res.status(500).json({ error: "Ein interner Serverfehler beim zurücksetzen der VM ist aufgetreten." });
    }
});

router.get("/operation-status", async(req: Request, res: Response) =>{
    const {operationId} = req.body;
    const op = await exoscaleClient.getOperation({id : operationId});

    return res.json({
        state: op.state,
        message: op.message,
        reason: op.reason,
    })
});

router.put("/:uuid/start", async (req: Request<{ uuid: string }>, res: Response) => {
    try {
        const { uuid } = req.params;

        if (!uuid || !UUID_REGEX.test(uuid)) {
            return res.status(400).json({ error: "Ungültiges UUID-Format." });
        }

        await startVm(uuid, req.user!);

        return res.status(200).json({
            message: "VM wurde erfolgreich gestartet."
        });
    } catch (error: any) {
        if (error instanceof ServiceError) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error("Unhandled error in PUT /api/vms/:uuid/start:", error);
        return res.status(500).json({ error: "Ein interner Serverfehler ist aufgetreten." });
    }
});


router.put("/:uuid/stop",async (req: Request<{ uuid: string }>, res: Response) => {
    try{
        const { uuid } = req.params;

        if (!uuid || !UUID_REGEX.test(uuid)) {
            return res.status(400).json({ error: "Ungültiges UUID-Format." });
        }

        await stopVm(uuid, req.user!);

        return res.status(200).json({
            message: "VM wurde erfolgreich gestoppt."
        });
    }catch(error: any){
        if (error instanceof ServiceError) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error("Unhandled error in PUT /api/{uuid}/stop:", error);
        return res.status(500).json({ error: "Ein interner Serverfehler ist aufgetreten." });
    }
});

export default router;