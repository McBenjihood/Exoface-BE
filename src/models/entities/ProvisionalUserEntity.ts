import { Entity, PrimaryGeneratedColumn, Column} from "typeorm";

export enum UserRole {
    TEACHER = 'teacher',
    STUDENT = 'student',
}

@Entity('provisionalUser')
export default class ProvisionalUserEntity {
    @PrimaryGeneratedColumn({name: 'userId'})
    userId: number;

    @Column({type: 'varchar', length: 50, nullable: true})
    name: string;

    @Column({type: 'varchar', length: 50, nullable: true})
    surname: string;

    @Column({type: 'varchar', length: 50, unique: true, nullable: true})
    email: string;

    @Column({
        type: 'enum',
        enum: UserRole,
    })
    role: UserRole;

    @Column({type: 'int', nullable: true})
    classId: number | null;
}