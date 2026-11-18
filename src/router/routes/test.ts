import { Router } from "express";
import type { Request, Response } from "express";
import express from "express";
import {createTeacher} from '@/services/TeacherService.js'
import {sendLoginEmail} from  '@/services/EmailService.js'
import { ExoscaleClient } from '@exoscale/sdk'


const exoscaleClient = new ExoscaleClient({apiKey: process.env.EXOSCALE_API_KEY ?? '', apiSecret: process.env.EXOSCALE_API_SECRET ?? ''})
const router = Router();

router.post('/create-teacher',express.json(), (req: Request, res: Response) => {
    createTeacher(req.body.name, req.body.email, req.body.password);
    res.send('Hello World!');
});

router.get("/send-test", async (res: Response) => {
    try {
        await sendLoginEmail("benjaminmikagerresheim@gmail.com", "test", "123456");

        return res.status(200).json({
            message: "Test-E-Mail wurde erfolgreich gesendet!"
        });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

router.get("/test-exoscale-sdk", express.json(),async (res: Response)=> {
    const { templates = [] } = await exoscaleClient.listTemplates();
    return res.status(200).json({templates: templates});
});

export default router;