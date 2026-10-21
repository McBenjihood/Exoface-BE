import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";

@Entity('Class')
export default class ClassEntity {
    @PrimaryGeneratedColumn({name: 'classId'})
    classId: number;

    @Column({name: 'name', type: 'varchar', length: 50})
    name: string;
}