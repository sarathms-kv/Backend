import EmployeeRepository from "../repository/employee.repository";
import Employee from "../entity/employee.entity";
import Address from "../entity/address.entity";
import { AddressDto } from "../dto/createAddress.dto";
import { Role } from "../utils/role.enum";
import bcrypt from "bcrypt";
import { ErrorCodes } from "../utils/error.code";
import jsonwebtoken from "jsonwebtoken";
import { JWT_SECRET, JWT_VALIDITY } from "../utils/constants";
import { jwtPayload } from "../utils/jwtPayload";
import EntityNotFoundException from "../exception/entityNotFoundException";
import IncorrectPasswordException from "../exception/incorrectPassword.exception";
import DepartmentService from "./department.service";

class EmployeeServive {
  constructor(
    private employeeRepository: EmployeeRepository,
    private departmentService: DepartmentService
  ) {}

  getAllEmloyeees = async (): Promise<Employee[]> => {
    return this.employeeRepository.find();
  };

  getEmployeeById = async (id: number): Promise<Employee | null> => {
    return this.employeeRepository.findOneBy({ id });
  };

  createEmployee = async (
    email: string,
    name: string,
    address: AddressDto,
    password: string,
    role: Role,
    departmentId: number
  ): Promise<Employee> => {
    const newEmployee = new Employee();
    newEmployee.email = email;
    newEmployee.name = name;

    const newAddress = new Address();
    newAddress.line1 = address.line1;
    newAddress.pincode = address.pincode;

    newEmployee.address = newAddress;
    newEmployee.password = password ? await bcrypt.hash(password, 10) : "";
    newEmployee.role = role;
    newEmployee.departmentId = departmentId;

    const savedEmployee = await this.employeeRepository.save(newEmployee);
    const count = await this.departmentService.getEmployeesCount(
      Number(departmentId)
    );
    await this.departmentService.updateEmployeesCount(
      Number(departmentId),
      count + 1
    );
    return savedEmployee;
  };

  deleteEmployee = async (id: number): Promise<void> => {
    const employee = await this.getEmployeeById(id);
    const count = await this.departmentService.getEmployeesCount(
      Number(employee.departmentId)
    );
    await this.departmentService.updateEmployeesCount(
      Number(employee.departmentId),
      count - 1
    );
    await this.employeeRepository.softRemove(employee);
  };

  updateEmployee = async (
    id: number,
    email: string,
    name: string,
    address: AddressDto,
    departmentId: number
  ): Promise<Employee> => {
    try {
      const employee = await this.getEmployeeById(id);
      const previousDeptId = employee.departmentId;

      employee.email = email;
      employee.name = name;
      employee.address.line1 = address.line1;
      employee.address.pincode = address.pincode;
      employee.departmentId = departmentId;

      const updatedEmployee = await this.employeeRepository.save(employee);

      if (previousDeptId !== departmentId) {
        const previousDeptCount =
          await this.departmentService.getEmployeesCount(
            Number(previousDeptId)
          );
        await this.departmentService.updateEmployeesCount(
          Number(previousDeptId),
          previousDeptCount - 1
        );

        const newDeptCount = await this.departmentService.getEmployeesCount(
          Number(departmentId)
        );
        await this.departmentService.updateEmployeesCount(
          Number(departmentId),
          newDeptCount + 1
        );
      }

      return updatedEmployee;
    } catch (error) {
      console.error("Error updating employee:", error);
      throw new Error("Failed to update employee");
    }
  };

  loginEmployee = async (email: string, password: string) => {
    const employee = await this.employeeRepository.findOneBy({ email });

    if (!employee) {
      throw new EntityNotFoundException(ErrorCodes.EMPLOYEE_WITH_ID_NOT_FOUND);
    }

    const result = await bcrypt.compare(password, employee.password);

    if (!result) {
      throw new IncorrectPasswordException(ErrorCodes.INCORRECT_PASSWORD);
    }

    const payload: jwtPayload = {
      name: employee.name,
      email: employee.email,
      role: employee.role,
    };

    const token = jsonwebtoken.sign(payload, JWT_SECRET, {
      expiresIn: JWT_VALIDITY,
    });
    return { token };
  };
}

export default EmployeeServive;
