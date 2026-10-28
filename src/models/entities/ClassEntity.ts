import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import ClassModuleEntity from "@/models/entities/ClassModuleEntity.js";

@Entity({ name: 'Class'})
export default class ClassEntity {
    @PrimaryGeneratedColumn({name: 'classId'})
    classId!: number;

    @Column({name: 'name', type: 'varchar', length: 50})
    name!: string;

    @OneToMany(() => ClassModuleEntity, (cm) => cm.class)
    classModules!: ClassModuleEntity[];
}