import express, { Router } from "express";
import type { Request, Response } from "express";
import {addModule} from "@/services/ModuleService.js";
import {authenticateJwt, requireRole} from "@/middleware/authMiddleware.js"

const router = Router();

router.use(authenticateJwt);
router.post("/addmodule",requireRole("teacher", "admin"), (req: Request, res: Response) => {
    try {
        const {shortcut, description} = req.body;
        const teacherid = (req as any).user?.userId;

        const newModule = addModule(shortcut, description, teacherid);

    } catch (e) {
        console.error(e);

    }
});

export default router;