import ProvisionalUserEntity from "@/models/entities/ProvisionalUserEntity.js"
import {AppDataSource} from "@/models/datasource.js";
import type { Response } from "express";


const TeacherRepository = AppDataSource.getRepository(TeacherEntity)

export function addProvisionalUser(name: string, email: string, password : string){
    const newTeacher = new TeacherEntity();
    newTeacher.name = name;
    newTeacher.email = "john@teacher.com";
    newTeacher.password = "12345678";
    try {
        TeacherRepository.save(newTeacher);
    }catch (e) {
        console.log(e)
    }
}