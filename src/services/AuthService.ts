import UserEntity from "@/models/entities/UserEntity.js"
import ProvisionalUserEntity from "@/models/entities/ProvisionalUserEntity.js"
import { ProvisionalUserCodeEntity } from '@/models/entities/ProvisionalUserCodeEntity.js'
import {AppDataSource} from "@/models/datasource.js";
import jwt from "jsonwebtoken";
import type { Response } from "express";
import {randomInt} from "node:crypto";
import {sendLoginEmail} from "@/services/EmailService.js";


const UserRepository = AppDataSource.getRepository(UserEntity);
const ProvisionalUserCodeRepository = AppDataSource.getRepository(ProvisionalUserCodeEntity);
const ProvisionalUserRepository = AppDataSource.getRepository(ProvisionalUserEntity);

export function createJWT(user: UserEntity) {
    return jwt.sign({
            iss: process.env.JWT_ISSUER,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600,
            sub: String(user.userId),
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET as string
    );
}

export async function initUserRegister(res: Response, email: string){
    try{
        const userById: ProvisionalUserEntity = await ProvisionalUserRepository.findOneByOrFail({email: email});
        if (userById){
            await sendLoginEmail(email, userById.name, await initProvUserCode(userById));
            return res.status(200).json({
                message: "Email mit Code wurde versendet."
            });
        }else {
            return res.status(404).json({
                message: "Unknown Error"
            });
        }
    }catch (e) {
        console.log(e)
        return res.status(404).json({
            message: "No User with this Email was found."
        });    }
}

export async function initProvUserCode(user: ProvisionalUserEntity){
    const userCodeEntity = new ProvisionalUserCodeEntity();
    userCodeEntity.code = generateOTP(6);
    userCodeEntity.enabled = true;

    await ProvisionalUserCodeRepository.save(userCodeEntity);

    user.userCode = userCodeEntity;
    await ProvisionalUserRepository.save(user);
    return userCodeEntity.code;
}

function generateOTP(length: number): string {
    const max = 10 ** length;
    return randomInt(0, max).toString().padStart(length, '0');
}