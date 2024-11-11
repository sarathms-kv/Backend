import { Request } from "express";
import { Role } from "./role.enum";

export interface RequestForDept extends Request {
  name: string;
  email: string;
  role: Role;
  departmentName: string;
}
