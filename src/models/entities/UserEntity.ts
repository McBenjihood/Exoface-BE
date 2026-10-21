import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "User" })
export default class UserEntity {
    @PrimaryGeneratedColumn({ name: "userId" })
    userId: number;

    @Column("varchar", { length: 50 })
    name: string;

    @Column("varchar", { length: 50 })
    surname: string;

    @Column("varchar", { length: 100, unique: true })
    email: string;

    @Column("varchar", { length: 255 })
    password: string;

    @Column("varchar", { length: 50 })
    role: string;
}