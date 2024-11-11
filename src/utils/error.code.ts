export const ErrorCodes = {
  INCORRECT_PASSWORD: {
    CODE: "INCORRECT_PASSWORD",
    MESSAGE: "Incorrect password",
  },

  UNAUTHORIZED: {
    CODE: "UNAUTHORIZED",
    MESSAGE: "You are not authorized to perform this action",
  },

  EMPLOYEE_WITH_ID_NOT_FOUND: {
    CODE: "EMPLOYEE_WITH_ID_NOT_FOUND",
    MESSAGE: "Employee with this id not found",
  },

  DEPARTMENT_HAS_EMPLOYEES: {
    CODE: "DEPARTMENT_HAS_EMPLOYEES",
    MESSAGE: "Department has employees",
  },

  DEPARTMENT_ALREADY_EXISTING: {
    CODE: "DEPARTMENT_ALREADY_EXISTING",
    MESSAGE: "This department already exists"
  }
};

export type CustomError = typeof ErrorCodes[keyof typeof ErrorCodes];