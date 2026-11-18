import express, { Router } from "express";
import type { Request, Response } from "express";
import {addModule, getModulesByTeacher} from "@/services/ModuleService.js";
import {authenticateJwt, requireRole} from "@/middleware/authMiddleware.js"
import {require} from "tsx/cjs/api";

const router = Router();

router.use(authenticateJwt);
router.post("/addmodule",requireRole("teacher", "admin"), async (req: Request, res: Response) => {
    try {
        const {shortcut, description} = req.body;
        const teacherid = (req as any).user?.userId;

        const newModule = await addModule(shortcut, description, teacherid);


        return res.status(201).json({
            message: "Modul erfolgreich erstellt",
            data: newModule
        });
    } catch (e) {
        console.error(e);
    }
});
router.get("/showmodules",requireRole("teacher","admin"), async (req: Request, res: Response) => {
    try{
        const teacherId = (req as any).user?.userId;

        const modules = await getModulesByTeacher(Number(teacherId));

        const simplifiedModules = modules.map(m => ({
            shortcut: m.shortcut,
            description: m.description
        }));

        return res.status(200).json({
            message: "Module erfolgreich abgerufen",
            data: simplifiedModules
        });
    } catch (e: any) {
        console.error(e);
    }
})

export default router;