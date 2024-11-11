import { CustomError } from "../utils/error.code";
import HttpException from "./http.exception";

class DepartmentAlreadyExistingException extends HttpException {
  constructor(error: CustomError) {
    super(404, error.MESSAGE);
  }
}

export default DepartmentAlreadyExistingException;
