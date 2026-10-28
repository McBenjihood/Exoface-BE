import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import UserEntity from "@/models/entities/UserEntity.js";

@Entity({ name: "Vm" })
export default class VmEntity {
    @PrimaryGeneratedColumn({ name: "vmId" })
    vmId!: number;

    @Column({ type: "varchar", length: 36})
    uuid!: string;

    @Column({ type: "varchar", length: 50})
    name!: string;

    @Column({ type: "varchar", name: "userId"})
    userId!: number;

    @ManyToOne(() => UserEntity, (user) => user.vms, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user!: UserEntity;
}