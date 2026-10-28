import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import ClassModuleEntity from "@/models/entities/ClassModuleEntity.js";
import UserModuleEntity from "@/models/entities/UserModuleEntity.js";

@Entity({name: "Module"})
export default class ModuleEntity {
    @PrimaryGeneratedColumn({ name: "moduleId" })
    moduleId!: number;

    @Column({ type: "varchar", length: 10, unique: true, nullable: true })
    shortcut!: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    description!: string;

    @OneToMany(() => ClassModuleEntity, (cm) => cm.module)
    classModules!: ClassModuleEntity[];

    @OneToMany(() => UserModuleEntity, (um) => um.module)
    userModules!: UserModuleEntity[];
}