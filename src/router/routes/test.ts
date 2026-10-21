import { Router } from "express";
import type { Request, Response } from "express";
import express from "express";
import {createTeacher} from '@/services/TeacherService.js'

const router = Router();

router.post('/create-teacher',express.json(), (req: Request, res: Response) => {
    createTeacher(req.body.name, req.body.email, req.body.password);
    res.send('Hello World!');
});

export default router;