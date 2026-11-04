import ProvisionalUserEntity, {UserRole} from "@/models/entities/ProvisionalUserEntity.js"
import {AppDataSource} from "@/models/datasource.js";
import type { Response } from "express";


const ProvisionalUserRepository = AppDataSource.getRepository(ProvisionalUserEntity);

export  function addProvisionalUser(name: string, surname: string, email: string, classname: string, role : UserRole){
    const newUser = new ProvisionalUserEntity();
    newUser.name = name;
    newUser.surname = surname;
    newUser.email = email;
    newUser.role = role;
    newUser.class = classname;

    try {
         ProvisionalUserRepository.save(newUser);
    }catch (e) {
        console.log(e)
    }
}