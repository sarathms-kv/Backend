import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import "reflect-metadata";
import { Role } from "../utils/role.enum";

export class CreateDepartmentDto {
    @IsNotEmpty()
    @IsString()
    departmentName: string;
}