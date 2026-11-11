import UserEntity from "@/models/entities/UserEntity.js"
import ProvisionalUserEntity from "@/models/entities/ProvisionalUserEntity.js"
import {ProvisionalUserCodeEntity} from '@/models/entities/ProvisionalUserCodeEntity.js'
import {AppDataSource} from "@/models/datasource.js";
import jwt from "jsonwebtoken";
import type {Response} from "express";
import {randomInt} from "node:crypto";
import {sendLoginEmail} from "@/services/EmailService.js";
import bcrypt from "bcrypt";


const UserRepository = AppDataSource.getRepository(UserEntity);
const ProvisionalUserCodeRepository = AppDataSource.getRepository(ProvisionalUserCodeEntity);
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
        console.log(e);
        return res.status(404).json({
            message: "No User with this Email was found."
        });    }
}

export async function initProvUserCode(user: ProvisionalUserEntity){
    const provUserCodeEntity = new ProvisionalUserCodeEntity();
    provUserCodeEntity.code = generateOTP(6);
    provUserCodeEntity.enabled = true;

    await ProvisionalUserCodeRepository.save(provUserCodeEntity);

    user.userCode = provUserCodeEntity;
    await ProvisionalUserRepository.save(user);
    return provUserCodeEntity.code;
}

export async function verifyUserRegister(res: Response,email: String, otp: String, password: String){
    try{
        const provUserEntity = await ProvisionalUserRepository.findOneByOrFail({email: email});
        const provUserCodeEntity = provUserEntity.userCode;
        if (provUserCodeEntity.enabled && provUserCodeEntity.code == otp){
            const userEntity = new UserEntity(
                provUserEntity.name,
                provUserEntity.surname,
                provUserEntity.email,
                await bcrypt.hash(password, 10),
                provUserEntity.role,
            );
            await UserRepository.save(userEntity);

            await ProvisionalUserRepository.remove(provUserEntity);
            return res.status(200).json({
                message: "User registered successfully."
            })
        }else {
            return res.status(400).json({
                message: "Couldn't verify this One-Time-Password"
            });
        }
    }catch (e) {
        console.log(e);
        return res.status(400).json({
            message: "Error"
        });
    }
}

function generateOTP(length: number): string {
    const max = 1000000;
    return randomInt(0, max).toString().padStart(length, '0');
}