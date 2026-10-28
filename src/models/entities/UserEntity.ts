import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import VmEntity from "@/models/entities/VmEntity.js";
import UserModuleEntity from "@/models/entities/UserModuleEntity.js";

@Entity({ name: "User" })
export default class UserEntity {
    @PrimaryGeneratedColumn({ name: "userId" })
    userId!: number;

    @Column({ type: "varchar", length: 50 })
    name!: string;

    @Column({ type: "varchar", length: 50 })
    surname!: string;

    @Column({ type: "varchar", length: 100, unique: true })
    email!: string;

    @Column({ type: "varchar", length: 255 })
    password!: string;

    @Column({ type: "varchar",length: 50 })
    role!: string;

    @OneToMany(() => VmEntity, (vm) => vm.user)
    vms!: VmEntity[];

    @OneToMany(() => UserModuleEntity, (um) => um.user)
    userModules!: UserModuleEntity[];
}