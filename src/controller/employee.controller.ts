import express from "express";
import EmployeeService from "../service/employee.service";
import HttpException from "../exception/http.exception";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateEmployeeDto } from "../dto/createEmployee.dto";
import authorize from "../middleware/authorize.middleware";
import IncorrectPasswordException from "../exception/incorrectPassword.exception";
import { ErrorCodes } from "../utils/error.code";
import { Role } from "../utils/role.enum";
import { RequestWithUser } from "../utils/requestWithUser";

class EmployeeController {
  public router: express.Router;
  constructor(private employeeService: EmployeeService) {
    this.router = express.Router();

    this.router.get("/", this.getAllEmployees);
    this.router.get("/:id", this.getEmployeeById);
    this.router.post("/", authorize, this.createEmployee);
    this.router.delete("/:id", this.deleteEmployee);
    this.router.put("/:id", this.updateEmployee);
    this.router.post("/login", this.loginEmployee);
  }

  public loginEmployee = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { email, password } = req.body;
    try {
      const token = await this.employeeService.loginEmployee(email, password);
      res.status(200).send({ data: token });
    } catch (error) {
      next(error);
    }
  };

  public getAllEmployees = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const employees = await this.employeeService.getAllEmloyeees();
      res.status(200).send(employees);
    } catch (error) {
      next(error);
    }
  };

  public getEmployeeById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const employeeId = Number(req.params.id);
      const employee = await this.employeeService.getEmployeeById(employeeId);
      if (!employee) {
        const error = new HttpException(
          404,
          `No employee found with id: ${req.params.id}`
        );
        throw error;
      }
      res.status(200).send(employee);
    } catch (error) {
      next(error);
    }
  };

  public createEmployee = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const role = req.role;
      if (role !== Role.HR) {
        throw new IncorrectPasswordException(ErrorCodes.UNAUTHORIZED);
      }
      const employee = plainToInstance(CreateEmployeeDto, req.body);
      const errors = await validate(employee);

      if (errors.length > 0) {
        console.log(JSON.stringify(errors));
        throw new HttpException(400, JSON.stringify(errors));
      }

      const savedEmployee = await this.employeeService.createEmployee(
        employee.email,
        employee.name,
        employee.address,
        employee.password,
        employee.role,
        employee.departmentId
      );
      res.status(200).send(savedEmployee);
    } catch (error) {
      next(error);
    }
  };

  public deleteEmployee = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const employeeId = Number(req.params.id);
      await this.employeeService.deleteEmployee(employeeId);
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  };

  public updateEmployee = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const employeeId = Number(req.params.id);
      const employee = plainToInstance(CreateEmployeeDto, req.body);
      const errors = await validate(employee);

      if (errors.length > 0) {
        console.log(JSON.stringify(errors));
        throw new HttpException(400, JSON.stringify(errors));
      }

      const updatedEmployee = await this.employeeService.updateEmployee(
        employeeId,
        employee.email,
        employee.name,
        employee.address,
        employee.departmentId
      );
      res.status(200).send(updatedEmployee);
    } catch (error) {
      next(error);
    }
  };
}

export default EmployeeController;
