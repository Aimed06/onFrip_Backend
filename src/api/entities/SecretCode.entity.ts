import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, CreateDateColumn } from "typeorm";
import { IsBoolean, IsEmail, IsNumber, IsString } from "class-validator";
import { User } from "./User.entity";

@Entity("secret_codes")
export class SecretCode extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @IsString()
    email!: string;

    @Column()
    @IsNumber()
    code!: number;

    @Column({
        name: 'is_used',
        default: false
    })
    @IsBoolean()
    isUsed!: boolean;

    @Column({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
        name: 'created_at'
    })
    createdAt!: Date;
}