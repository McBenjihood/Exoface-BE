import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ProvisionalUserCodeEntity } from "@/models/entities/ProvisionalUserCodeEntity.js";

export enum UserRole {
  TEACHER = "teacher",
  STUDENT = "student",
}

@Entity({ name: "ProvisionalUser" })
export default class ProvisionalUserEntity {
  @PrimaryGeneratedColumn({ name: "userId" })
  userId!: number;

  @Column({ type: "varchar", length: 50, nullable: true })
  name!: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  surname!: string;

  @Column({ type: "varchar", length: 50, unique: true, nullable: true })
  email!: string;

  @Column({
    type: "enum",
    enum: UserRole,
  })
  role!: UserRole;

  @Column({ type: "varchar", length: 50, nullable: true })
  class!: string;

  @Column({ type: "int", nullable: true, name: "userCodeId" })
  userCodeId!: number | null;

  @ManyToOne(
    () => ProvisionalUserCodeEntity,
    (userCode) => userCode.provisionalUsers,
    {
      onDelete: "CASCADE",
    },
  )
  @JoinColumn({ name: "userCodeId" })
  userCode!: ProvisionalUserCodeEntity;
}
