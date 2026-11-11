import UserEntity from "@/models/entities/UserEntity.js";
import ProvisionalUserEntity from "@/models/entities/ProvisionalUserEntity.js";
import { ProvisionalUserCodeEntity } from '@/models/entities/ProvisionalUserCodeEntity.js';
import { AppDataSource } from "@/models/datasource.js";
import jwt from "jsonwebtoken";
import type { Response } from "express";
import { randomInt } from "node:crypto";
import { sendLoginEmail } from "@/services/EmailService.js";
import bcrypt from "bcrypt";

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

export async function initUserRegister(res: Response, email: string) {
    try {
        const userById = await ProvisionalUserRepository.findOneBy({ email: email });

        if (userById) {
            await sendLoginEmail(email, userById.name, await initProvUserCode(userById));
        }

        return res.status(200).json({
            message: "Falls ein passendes Konto existiert, wurde eine E-Mail mit einem Code versendet."
        });
    } catch (e) {
        console.error("Failed to initiate user registration:", e);
        return res.status(500).json({
            message: "Registrierung konnte nicht gestartet werden. Bitte versuche es erneut."
        });
    }
}

export async function initProvUserCode(user: ProvisionalUserEntity) {
    const provUserCodeEntity = new ProvisionalUserCodeEntity();
    provUserCodeEntity.code = generateOTP(6);
    provUserCodeEntity.enabled = true;

    await ProvisionalUserCodeRepository.save(provUserCodeEntity);

    user.userCode = provUserCodeEntity;
    await ProvisionalUserRepository.save(user);
    return provUserCodeEntity.code;
}

export async function verifyUserRegister(res: Response, email: string, otp: string, password: string) {
    try {
        const provUserEntity = await ProvisionalUserRepository.findOneBy({ email: email });
        if (!provUserEntity || !provUserEntity.userCode) {
            return res.status(400).json({
                message: "Couldn't verify this One-Time-Password"
            });
        }

        const provUserCodeEntity = provUserEntity.userCode;

        if (provUserCodeEntity.enabled && provUserCodeEntity.code === otp) {
            await AppDataSource.transaction(async (transactionalEntityManager) => {
                const userEntity = new UserEntity(
                    provUserEntity.name,
                    provUserEntity.surname,
                    provUserEntity.email,
                    await bcrypt.hash(password, 10),
                    provUserEntity.role,
                );
                await transactionalEntityManager.save(userEntity);
                await transactionalEntityManager.remove(provUserEntity);
            });
            return res.status(200).json({
                message: "User registered successfully."
            });
        } else {
            return res.status(400).json({
                message: "Couldn't verify this One-Time-Password"
            });
        }
    } catch (e) {
        console.error("Failed to verify user registration:", e);
        return res.status(500).json({
            message: "Registrierung konnte nicht abgeschlossen werden. Bitte versuche es erneut."
        });
    }
}

function generateOTP(length: number): string {
    const max = 1000000;
    return randomInt(0, max).toString().padStart(length, '0');
}