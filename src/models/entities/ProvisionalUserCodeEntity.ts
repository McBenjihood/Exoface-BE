import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import ProvisionalUserEntity from "@/models/entities/ProvisionalUserEntity.js";

@Entity({ name: "ProvisionalUserCode" })
export class ProvisionalUserCodeEntity {
    @PrimaryGeneratedColumn({ type: "int", name: "userCodeId" })
    userCodeId!: number;

    @Column({ type: "boolean", nullable: true })
    enabled!: boolean;

    @Column({ type: "varchar", length: 50, nullable: true })
    code!: string;

    @Column({ type: "int", unsigned: true, default: () => "UNIX_TIMESTAMP()" })
    createdAt!: number;

    @Column({ type: "int", unsigned: true, default: () => "(UNIX_TIMESTAMP() + 900)" })
    expiredAt!: number;

    @OneToOne(() => ProvisionalUserEntity, (user) => user.userCode)
    provisionalUser!: ProvisionalUserEntity;
}