import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import UserEntity from "@/models/entities/UserEntity.js";
import ClassEntity from "@/models/entities/ClassEntity.js";

@Entity({name: "UserClassEntity"})
export default class UserClassEntity {
    @PrimaryColumn({type: "int", name: "userId" })
    moduleId!: number;

    @PrimaryColumn({type: "int", name: "classId" })
    classId!: number;


    @ManyToOne(() => UserEntity, (user) => user.userClasses, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user!: UserEntity;

    @ManyToOne(() => ClassEntity, (cls) => cls.classUsers, { onDelete: "CASCADE" })
    @JoinColumn({ name: "classId" })
    class!: ClassEntity;
}