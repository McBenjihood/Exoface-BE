import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import UserEntity from "@/models/entities/UserEntity.js";
import ClassEntity from "@/models/entities/ClassEntity.js";

@Entity({name: "UserClass"})
export default class UserClassEntity {
    @PrimaryColumn({type: "int", name: "userId" })
    userId!: number;

    @PrimaryColumn({type: "int", name: "classId" })
    classId!: number;


    @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user!: UserEntity;

    @ManyToOne(() => ClassEntity, { onDelete: "CASCADE" })
    @JoinColumn({ name: "classId" })
    class!: ClassEntity;
}