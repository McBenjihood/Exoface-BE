import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import ModuleEntity from "@/models/entities/ModuleEntity.js";
import UserEntity from "@/models/entities/UserEntity.js";

@Entity("UserModule")
export default class UserModuleEntity {
    @PrimaryColumn({ name: "moduleId" })
    moduleId: number;

    @PrimaryColumn({ name: "userId" })
    userId: number;

    @ManyToOne(() => ModuleEntity, (module) => module.userModules, { onDelete: "CASCADE" })
    @JoinColumn({ name: "moduleId" })
    module: ModuleEntity;

    @ManyToOne(() => UserEntity, (user) => user.userModules, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: UserEntity;
}