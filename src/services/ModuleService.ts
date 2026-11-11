import UserEntity from "@/models/entities/UserEntity.js"
import UserModuleEntity from "@/models/entities/UserModuleEntity.js"
import ModuleEntity from "@/models/entities/ModuleEntity.js"
import teacherid from "@/router/routes/module.js"
import {AppDataSource} from "@/models/datasource.js";
import type { Response } from "express";


const UserRepository = AppDataSource.getRepository(UserEntity);
const ModuleRepository = AppDataSource.getRepository(ModuleEntity);
const UserModuleRepository = AppDataSource.getRepository(UserModuleEntity);






export async function addModule(shortcut: string, description: string, teacherid :number) {
    try {
        const userId = Number(teacherid);
        const newModule = new ModuleEntity();
        newModule.shortcut = shortcut;
        newModule.description = description;

        const savedModule = await ModuleRepository.save(newModule);

        await UserModuleRepository.insert({
            userId: userId,
            moduleId: savedModule.moduleId
        });

        console.log("Modul erstellt");
        return savedModule;

    } catch (e) {
        console.error("Fehler beim Speichern:", e);
        throw e;
    }
}