import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from "typeorm";
import ClassModuleEntity from "@/models/entities/ClassModuleEntity.js";
import UserModuleEntity from "@/models/entities/UserModuleEntity.js";

@Entity("Module")
export default class ModuleEntity {
    @PrimaryGeneratedColumn({ name: "moduleId" })
    moduleId: number;

    @Column({ type: "varchar", length: 10, unique: true, nullable: true })
    shortcut: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    description: string;

    @OneToMany(() => ClassModuleEntity, (cm) => cm.module)
    classModules: ClassModuleEntity[];

    @OneToMany(() => UserModuleEntity, (um) => um.module)
    userModules: UserModuleEntity[];
}