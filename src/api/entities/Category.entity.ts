import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Unique, OneToMany, ManyToOne, JoinColumn, ManyToMany, JoinTable, PrimaryColumn, Index } from "typeorm";
import { IsBoolean, IsEmail, IsNumber, IsPositive, Length } from "class-validator";
import { Product } from "./Product.entity";



@Entity("categories")
export class Category extends BaseEntity{
    @PrimaryColumn()
    @Index()
    id!: string
  
    @Column()
    name!: string;

    @OneToMany(() => Product, product => product.category )
    products!: Product[];


}