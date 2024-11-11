import express from "express";
import { CreateDepartmentDto } from "../dto/createDepartment.dto";
import HttpException from "../exception/http.exception";
import authorize from "../middleware/authorize.middleware";
import { RequestForDept } from "../utils/requestForDept";
import { Role } from "../utils/role.enum";
import IncorrectPasswordException from "../exception/incorrectPassword.exception";
import { ErrorCodes } from "../utils/error.code";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import DepartmentService from "../service/department.service";
import { RequestWithUser } from "../utils/requestWithUser";

class DepartmentController {
  public router: express.Router;
  constructor(private departmentService: DepartmentService) {
    this.router = express.Router();

    this.router.get("/", this.getAllDepartments);
    this.router.get("/:id", this.getDepartmentById);
    this.router.post("/", authorize, this.createDepartment);
    this.router.delete("/:id", authorize, this.deleteDepartment);
    this.router.put("/:id", authorize, this.updateDepartment);
  }

  public getAllDepartments = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const departments = await this.departmentService.getAllDepartments();
      res.status(200).send(departments);
    } catch (error) {
      next(error);
    }
  };

  public getDepartmentById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const departmentId = Number(req.params.id);
      const department = await this.departmentService.getDepartmentById(
        departmentId
      );
      if (!department) {
        const error = new HttpException(
          404,
          `No department found with id: ${req.params.id}`
        );
        throw error;
      }
      res.status(200).send(department);
    } catch (error) {
      next(error);
    }
  };

  public createDepartment = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const role = req.role;
      if (role !== Role.HR) {
        throw new IncorrectPasswordException(ErrorCodes.UNAUTHORIZED);
      }

      const departmentData = plainToInstance(CreateDepartmentDto, req.body);
      const errors = await validate(departmentData);

      if (errors.length > 0) {
        console.log(JSON.stringify(errors));
        throw new HttpException(400, JSON.stringify(errors));
      }

      const newDepartment = await this.departmentService.createDepartment(
        departmentData.departmentName
      );
      res.status(201).send(newDepartment);
    } catch (error) {
      next(error);
    }
  };

  public deleteDepartment = async (
    req: RequestForDept,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const departmentId = Number(req.params.id);
      const deletedDepartment = await this.departmentService.deleteDepartment(
        departmentId
      );
      res.status(200).send(deletedDepartment);
    } catch (error) {
      next(error);
    }
  };

  public updateDepartment = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const departmentId = Number(req.params.id);
      const departmentData = plainToInstance(CreateDepartmentDto, req.body);
      const errors = await validate(departmentData);

      if (errors.length > 0) {
        console.log(JSON.stringify(errors));
        throw new HttpException(400, JSON.stringify(errors));
      }
      
      const updatedDepartment = await this.departmentService.updateDepartment(
        departmentId,
        departmentData.departmentName
      );
      res.status(200).send(updatedDepartment);
    } catch (error) {
      next(error);
    }
  };
}

export default DepartmentController;
