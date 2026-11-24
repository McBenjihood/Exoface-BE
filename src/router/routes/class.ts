import express, { Router } from "express";
import type { Request, Response } from "express";
import {authenticateJwt, requireRole} from "@/middleware/authMiddleware.js"
import {getClasses, findOrCreateClass, getStudentsOfClass} from "@/services/ClassesService.js";
import {addModule} from "@/services/ModuleService.js";

const router = Router();

router.use(authenticateJwt);
router.get("/showclasses",requireRole("teacher","admin"), async (req: Request, res: Response) => {
    try{

        const classes = await getClasses();
        const simplifiedClasses = classes.map(c => ({
            name: c.name
        }));

        return res.status(200).json({
            message: "erfolgreich",
            data: simplifiedClasses
        });
    } catch (e: any) {
        console.error(e);
    }
})

router.get("/:name/students", requireRole("teacher","admin"), async (req: Request, res: Response) => {
    try {
        const students = await getStudentsOfClass(req.params.name);

        return res.status(200).json({
            message: "erfolgreich",
            data: students
        });
    } catch (e: any) {
        console.error(e);
        return res.status(500).json({ error: "Lernende konnten nicht geladen werden." });
    }
});




export default router;