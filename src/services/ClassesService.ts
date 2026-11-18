import {AppDataSource} from "@/models/datasource.js";
import type { Response } from "express";
import { In } from "typeorm";
import ClassEntity from "@/models/entities/ClassEntity.js";

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