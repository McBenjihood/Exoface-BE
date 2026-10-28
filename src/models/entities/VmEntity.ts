import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import UserEntity from "@/models/entities/UserEntity.js";

@Entity("Vm")
export default class VmEntity {
    @PrimaryGeneratedColumn({ name: "vmId" })
    vmId: number;

    @Column({ type: "varchar", length: 50, nullable: true })
    name: string;

    @Column({ name: "userId", nullable: true })
    userId: number;

    @ManyToOne(() => UserEntity, (user) => user.vms, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: UserEntity;
}