import { Column, Entity, OneToMany } from "typeorm";
import AbstractEntity from "./abstract-entity";
import { DepartmentName } from "../utils/dept.enum";
import Employee from "./employee.entity";

@Entity()
class Department extends AbstractEntity {
  @Column()
  departmentName: string;

  @Column({ nullable: true })
  noOfEmployees: number;

  @OneToMany(() => Employee, (employee) => employee.department, {
    cascade: true,
    onDelete: "CASCADE",
  })
  employee: Employee[];
}

export default Department;
