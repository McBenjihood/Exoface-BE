import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import ModuleEntity from "@/models/entities/ModuleEntity.js";
import ClassEntity from "@/models/entities/ClassEntity.js";

@Entity({name: "ClassModule"})
export default class ClassModuleEntity {
    @PrimaryColumn({type: "int", name: "moduleId" })
    moduleId!: number;

    @PrimaryColumn({type: "int", name: "classId" })
    classId!: number;

    @ManyToOne(() => ModuleEntity, (module) => module.classModules, { onDelete: "CASCADE" })
    @JoinColumn({ name: "moduleId" })
    module!: ModuleEntity;

    @ManyToOne(() => ClassEntity, (cls) => cls.classModules, { onDelete: "CASCADE" })
    @JoinColumn({ name: "classId" })
    class!: ClassEntity;
}