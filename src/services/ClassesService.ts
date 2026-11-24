import {AppDataSource} from "@/models/datasource.js";
import type { Response } from "express";
import { In } from "typeorm";
import ClassEntity from "@/models/entities/ClassEntity.js";
import UserEntity from "@/models/entities/UserEntity.js";
import ProvisionalUserEntity, {UserRole} from "@/models/entities/ProvisionalUserEntity.js";

const ClassRepository = AppDataSource.getRepository(ClassEntity);

export async function getClasses() {
    try {

        const classes = await ClassRepository.find({

        });
        return classes;

    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function findOrCreateClass(className: string) {
    try {
        let classEntity = await ClassRepository.findOneBy({ name: className });

        if (!classEntity) {
            classEntity = new ClassEntity();
            classEntity.name = className;
            await ClassRepository.save(classEntity);
            console.log(`Klasse ${className} erfolgreich in DB gespeichert!`);
        }
        return classEntity;
    } catch (e) {
        console.error(`Fehler bei findOrCreateClass für ${className}:`, e);
        throw e;
    }

}

export async function getStudentsOfClass(className: string) {
    const classEntity = await ClassRepository.findOneBy({ name: className });

    const registrierte = classEntity
        ? await AppDataSource.getRepository(UserEntity).find({
            where: { classId: classEntity.classId, role: "student" }
        })
        : [];

    const provisorische = await AppDataSource.getRepository(ProvisionalUserEntity).find({
        where: { class: className, role: UserRole.STUDENT }
    });

    return [
        ...registrierte.map(u => ({
            userId: u.userId,
            name: u.name,
            surname: u.surname,
            email: u.email,
            registriert: true
        })),
        ...provisorische.map(p => ({
            userId: null,
            name: p.name,
            surname: p.surname,
            email: p.email,
            registriert: false
        }))
    ];
}