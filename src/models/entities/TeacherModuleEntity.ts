import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import TeacherEntity from "@/models/entities/TeacherEntity.js";

@Entity({ name: "TeacherModule" }) // Matches CREATE TABLE TeacherModule
export default class TeacherModuleEntity {
    @PrimaryGeneratedColumn({type: "int", name: "teacherModuleID" })
    teacherModuleID!: number;

    @ManyToOne(() => TeacherEntity, (teacher) => teacher.teacherModules, { onDelete: "CASCADE" })
    @JoinColumn({ name: "teacherID" }) // Explicitly map to teacherID column
    teacher!: TeacherEntity;
}