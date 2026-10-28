import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import ModuleEntity from "@/models/entities/ModuleEntity.js";
import ClassEntity from "@/models/entities/ClassEntity.js";

@Entity("ClassModule")
export default class ClassModuleEntity {
    @PrimaryColumn({ name: "moduleId" })
    moduleId: number;

    @PrimaryColumn({ name: "classId" })
    classId: number;

    @ManyToOne(() => ModuleEntity, (module) => module.classModules, { onDelete: "CASCADE" })
    @JoinColumn({ name: "moduleId" })
    module: ModuleEntity;

    @ManyToOne(() => ClassEntity, (cls) => cls.classModules, { onDelete: "CASCADE" })
    @JoinColumn({ name: "classId" })
    class: ClassEntity;
}