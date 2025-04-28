import { IsEmail, Length } from "class-validator";
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Order } from "./Order.entity";
import { Product } from "./Product.entity";
import { VerificationRequest } from "./VerificationRequest.entity";
import { Notification } from "./Notification.entity";

export enum verificationStatus {
  WAITING = 0,
  VERIFIED = 1,
  REFUSED = 2,
}
export enum UserRole {
    CLIENT = "CLIENT",
    VENDOR = "VENDOR",
    BOTH = "BOTH",
  }
  

@Entity("users")
@Unique(["email"])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @Length(1, 50, {
    message: "Firstname too short or too long",
  })
  firstName!: string;

  @Column()
  @Length(1, 50, {
    message: "Lastname too short or too long",
  })
  lastName!: string;

  @Column()
  @IsEmail(undefined, {
    message: "Email is invalid",
  })
  email!: string;

  @Column()
  phone?: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role!: UserRole;

  @Column({
    type: "enum",
    enum: verificationStatus,
    default: verificationStatus.REFUSED,
  })
  verificationStatus!: verificationStatus;

  @Column({ nullable: true })
  socketId?: string;


  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    name: 'created_at'
  })
  createdAt!: Date
  
  @OneToMany(() => Notification, (notification) => notification.user)
  notifications!: Notification[];

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];





  @OneToMany(
    () => VerificationRequest,
    (verification_request) => verification_request.user
  )
  verification_request!: VerificationRequest[];

  @ManyToMany(() => Product, { eager: true })
  @JoinTable()
  favoriteProducts!: Product[];

  @OneToMany(() => Product, (product) => product.seller)
  products!: Product[];
}
