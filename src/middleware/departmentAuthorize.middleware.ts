import { NextFunction, Response } from "express";
import { RequestForDept } from "../utils/requestForDept";
import { JWT_SECRET } from "../utils/constants";
import jsonwebtoken from "jsonwebtoken";
import { jwtPayload } from "../utils/jwtPayload";

const departmentAuthorize = async (
  req: RequestForDept,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = getTokenFromrequestHeader(req);
    const payload = jsonwebtoken.verify(token, JWT_SECRET);

    req.name = (payload as jwtPayload).name;
    req.email = (payload as jwtPayload).email;
    req.role = (payload as jwtPayload).role;

    return next();
  } catch (error) {
    return next(error);
  }
};

const getTokenFromrequestHeader = (req: RequestForDept) => {
  const bearerToken = req.header("Authorization");
  const token = bearerToken ? bearerToken.replace("Bearer ", "") : "";
  return token;
};
