import UserEntity from "@/models/entities/UserEntity.js"
import ProvisionalUserEntity from "@/models/entities/ProvisionalUserEntity.js"
import {AppDataSource} from "@/models/datasource.js";
import jwt from "jsonwebtoken";
import type { Response } from "express";


const UserRepository = AppDataSource.getRepository(UserEntity);
const ProvisionalUserRepository = AppDataSource.getRepository(ProvisionalUserEntity);

export function createJWT(res: Response, sub: string, email: string, role: string){
    const token = jwt.sign({
            iss: process.env.JWT_ISSUER,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600,
            sub: sub,
            email: email,
            role: role
        },
        process.env.JWT_SECRET as string
    );

    return res.status(200).json({
        message: "Erfolgreich eingeloggt",
        token: token
    });
}

export async function initUserRegister(res: Response, email: string){
    try{
        const userById: ProvisionalUserEntity = await ProvisionalUserRepository.findOneByOrFail({email: email});
        if (userById){

        }
    }catch (e) {

    }

}