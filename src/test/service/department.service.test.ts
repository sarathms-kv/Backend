import { jest } from "@jest/globals";
import Department from "../../entity/department.entity";
import DepartmentAlreadyExistingException from "../../exception/departmentAlreadyExistingException";
import DepartmentNotNullException from "../../exception/departmentNotNullException";
import DepartmentRepository from "../../repository/department.repository";
import DepartmentService from "../../service/department.service";

describe("DepartmentService", () => {
  let departmentService: DepartmentService;
  let departmentRepository: jest.Mocked<DepartmentRepository>;

  beforeEach(() => {
    departmentRepository = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
      softRemove: jest.fn(),
    } as unknown as jest.Mocked<DepartmentRepository>;

    departmentService = new DepartmentService(departmentRepository);
  });

  it("should get all departments", async () => {
    const departments = [new Department(), new Department()];
    departmentRepository.find.mockResolvedValue(departments);

    const result = await departmentService.getAllDepartments();

    expect(result).toEqual(departments);
    expect(departmentRepository.find).toHaveBeenCalledTimes(1);
  });

  it("should get department by id", async () => {
    const department = new Department();
    departmentRepository.findOneBy.mockResolvedValue(department);

    const result = await departmentService.getDepartmentById(1);

    expect(result).toEqual(department);
    expect(departmentRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it("should get department by name", async () => {
    const department = new Department();
    departmentRepository.findOneBy.mockResolvedValue(department);

    const result = await departmentService.getDepartmentByName("HR");

    expect(result).toEqual(department);
    expect(departmentRepository.findOneBy).toHaveBeenCalledWith({
      departmentName: "HR",
    });
  });

  it("should create a new department", async () => {
    const department = new Department();
    department.departmentName = "HR";
    departmentRepository.save.mockResolvedValue(department);

    const result = await departmentService.createDepartment("HR");

    expect(result).toEqual(department);
    expect(departmentRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ departmentName: "HR" })
    );
  });

  it("should throw error if department has employees", async () => {
    const department = new Department();
    department.noOfEmployees = 5;
    departmentRepository.findOneBy.mockResolvedValue(department);

    await expect(departmentService.deleteDepartment(1)).rejects.toThrow(
      DepartmentNotNullException
    );
  });

  it("should throw error if department name already exists", async () => {
    const department = new Department();
    departmentRepository.findOneBy.mockResolvedValue(department);

    await expect(
      departmentService.updateDepartment(1, "Existing Name")
    ).rejects.toThrow(DepartmentAlreadyExistingException);
  });

  it("should get employees count", async () => {
    const department = new Department();
    department.noOfEmployees = 10;
    departmentRepository.findOneBy.mockResolvedValue(department);

    const result = await departmentService.getEmployeesCount(1);

    expect(result).toBe(10);
  });

  it("should update employees count", async () => {
    const department = new Department();
    departmentRepository.findOneBy.mockResolvedValue(department);

    await departmentService.updateEmployeesCount(1, 20);

    expect(department.noOfEmployees).toBe(20);
    expect(departmentRepository.save).toHaveBeenCalledWith(department);
  });
});
