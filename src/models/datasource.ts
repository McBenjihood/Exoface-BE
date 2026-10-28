import "reflect-metadata"
import { DataSource } from "typeorm"
import * as dotenv from 'dotenv';
import TeacherEntity from '@/models/entities/TeacherEntity.js'
import TeacherModulesEntity from '@/models/entities/TeacherModuleEntity.js'
import UserEntity from "@/models/entities/UserEntity.js";
import ClassEntity from "@/models/entities/ClassEntity.js";
import ClassModuleEntity from "@/models/entities/ClassModuleEntity.js";
import ModuleEntity from "@/models/entities/ModuleEntity.js";
import ProvisionalUserEntity from "@/models/entities/ProvisionalUserEntity.js";
import UserModuleEntity from "@/models/entities/UserModuleEntity.js";
import VmEntity from "@/models/entities/VmEntity.js";


dotenv.config();

export const AppDataSource = new DataSource({
    type: "mariadb",
    host: "localhost",
    port: 3306,
    username: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "",
    entities: [TeacherEntity, TeacherModulesEntity, UserEntity, ClassEntity, ClassModuleEntity, ModuleEntity, UserModuleEntity, ProvisionalUserEntity, VmEntity],
})