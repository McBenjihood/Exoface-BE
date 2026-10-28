import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import TeacherModuleEntity from "@/models/entities/TeacherModuleEntity.js";

@Entity({ name: "teachers" })
export default class TeacherEntity {
    @PrimaryGeneratedColumn({ name: "teacherID" })
    teacherID!: number;

    @Column("varchar", { length: 50 })
    name!: string;

    @Column("varchar", { length: 50, unique: true })
    email!: string;

    @Column("varchar", { length: 255 })
    password!: string;

    @OneToMany(() => TeacherModuleEntity, (module) => module.teacher)
    teacherModules!: TeacherModuleEntity[];
}