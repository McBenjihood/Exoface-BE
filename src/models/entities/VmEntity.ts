import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import UserEntity from "@/models/entities/UserEntity.js";

@Entity({ name: "Vm" })
export default class VmEntity {
    @PrimaryColumn({ type: "varchar", length: 36, name: "uuid" })
    uuid!: string;

    @Column({ type: "varchar", length: 50, name: "name", nullable: true })
    name!: string;

    @Column({ type: "int", name: "userId" })
    userId!: number;

    @ManyToOne(() => UserEntity, (user) => user.vms, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user!: UserEntity;
}