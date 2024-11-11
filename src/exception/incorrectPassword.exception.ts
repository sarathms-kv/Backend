import { CustomError } from "../utils/error.code";
import HttpException from "./http.exception";

class IncorrectPasswordException extends HttpException {
  constructor(error: CustomError) {
    super(401, error.MESSAGE);
  }
}

export default IncorrectPasswordException;
