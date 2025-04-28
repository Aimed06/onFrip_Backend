import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Unique, OneToMany, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { IsBoolean, IsEmail, Length } from "class-validator";
import { User } from "./User.entity";


@Entity("verification_requests")
export class VerificationRequest extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  document!: string;

  @Column({ default: false })
  isValid!: boolean;

  @ManyToOne(() => User, (user) => user.verification_request, { onDelete: "CASCADE", nullable: false, eager:true })
  @JoinColumn({ name: 'user_id' })
  user!: User

  @Column()
  user_id!: number;

}
