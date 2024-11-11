import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn, OneToOne } from "typeorm";
import AbstractEntity from "./abstract-entity";
import Employee from "./employee.entity";

@Entity()
class Address extends AbstractEntity {

  @Column()
  line1: string;

  @Column()
  pincode: string;

  @OneToOne(() => Employee, (employee) => employee.address) // specify inverse side as a second parameter
  @JoinColumn()
  employee: Employee

  @Column()
  employeeId: string;
}

export default Address;

