import Department from "../entity/department.entity";
import DepartmentAlreadyExistingException from "../exception/departmentAlreadyExistingException";
import DepartmentNotNullException from "../exception/departmentNotNullException";
import IncorrectPasswordException from "../exception/incorrectPassword.exception";
import DepartmentRepository from "../repository/department.repository";
import { ErrorCodes } from "../utils/error.code";
import { Role } from "../utils/role.enum";

class DepartmentService {
  constructor(private departmentRepository: DepartmentRepository) {}

  getAllDepartments = async (): Promise<Department[]> => {
    return this.departmentRepository.find();
  };

  getDepartmentById = async (id: number): Promise<Department | null> => {
    return this.departmentRepository.findOneBy({ id });
  };

  getDepartmentByName = async (
    departmentName: string
  ): Promise<Department | null> => {
    return this.departmentRepository.findOneBy({ departmentName });
  };

  createDepartment = async (departmentName: string): Promise<Department> => {
    const newDepartment = new Department();
    newDepartment.departmentName = departmentName;

    return this.departmentRepository.save(newDepartment);
  };

  deleteDepartment = async (id: number): Promise<void> => {
    const department = await this.getDepartmentById(id);
    if (department.noOfEmployees === null || department.noOfEmployees === 0) {
      await this.departmentRepository.softRemove(department);
    }
    throw new DepartmentNotNullException(ErrorCodes.DEPARTMENT_HAS_EMPLOYEES);
  };

  updateDepartment = async (
    id: number,
    departmentName: string
  ): Promise<Department> => {
    const department = await this.getDepartmentById(id);
    const existingDepartment = await this.getDepartmentByName(departmentName);
    if(existingDepartment){
      throw new DepartmentAlreadyExistingException(ErrorCodes.DEPARTMENT_ALREADY_EXISTING)
    }
    department.departmentName = departmentName;
    return this.departmentRepository.save(department);
  };

  getEmployeesCount = async (id: number): Promise<number> => {
    const department = await this.getDepartmentById(id);
    if (department.noOfEmployees === null) {
      return 0;
    }
    return department.noOfEmployees;
  };

  updateEmployeesCount = async (id: number, count: number): Promise<void> => {
    const department = await this.getDepartmentById(id);
    department.noOfEmployees = count;
    await this.departmentRepository.save(department);
  };
}

export default DepartmentService;
