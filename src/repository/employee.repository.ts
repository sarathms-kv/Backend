import dataSource from "../db/data-source.db";
import Employee from "../entity/employee.entity";
import { DataSource, Repository } from "typeorm";

class EmployeeRepository {
  constructor(private repository: Repository<Employee>) {}

  find = async (): Promise<Employee[]> => {
    return this.repository.find({ relations: ["address"] });
  };

  findOneBy = async (filter: Partial<Employee>): Promise<Employee | null> => {
    return this.repository.findOne({ where: filter, relations: ["address"] });
  };

  save = async (employee: Employee): Promise<Employee> => {
    return this.repository.save(employee);
  };

  softRemove = async (employee: Employee): Promise<void> => {
    await this.repository.softRemove(employee);
  };
}

export default EmployeeRepository;
