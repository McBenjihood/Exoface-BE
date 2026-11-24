import ProvisionalUserEntity, {UserRole} from "@/models/entities/ProvisionalUserEntity.js"
import {AppDataSource} from "@/models/datasource.js";
import type { Response } from "express";
import UserEntity from "@/models/entities/UserEntity.js";


const ProvisionalUserRepository = AppDataSource.getRepository(ProvisionalUserEntity);

export async function addProvisionalUser(name: string, surname: string, email: string, classname: string, role : UserRole){
    const bereitsRegistriert = await AppDataSource.getRepository(UserEntity).findOneBy({ email: email });
    if (bereitsRegistriert) {
        return;
    }

    const vorhanden = await ProvisionalUserRepository.findOneBy({ email: email });
    if (vorhanden) {
        vorhanden.name = name;
        vorhanden.surname = surname;
        vorhanden.class = classname;
        vorhanden.role = role;
        await ProvisionalUserRepository.save(vorhanden);
        return;
    }

    const newUser = new ProvisionalUserEntity();
    newUser.name = name;
    newUser.surname = surname;
    newUser.email = email;
    newUser.role = role;
    newUser.class = classname;
    await ProvisionalUserRepository.save(newUser);
}