import { Repository } from "typeorm";
import Department from "../entity/department.entity";

class DepartmentRepository {
  constructor(private repository: Repository<Department>) {}

    find = async (): Promise<Department[]> => {
        return this.repository.find({ relations: ["employee"] });
    };

    findOneBy = async (filter: Partial<Department>): Promise<Department | null> => {
        return this.repository.findOne({ where: filter, relations: ["employee"] });
    };

    save = async (department: Department): Promise<Department> => {
        return this.repository.save(department);
    };

    softRemove = async (department: Department): Promise<void> => {
        await this.repository.softRemove(department);
    };
}

export default DepartmentRepository;