import { NextFunction, Response } from "express";
import { JWT_SECRET } from "../utils/constants";
import { jwtPayload } from "../utils/jwtPayload";
import jsonwebtoken from "jsonwebtoken";
import { RequestWithUser } from "../utils/requestWithUser";

const authorize = async (
  req: RequestWithUser,
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

const getTokenFromrequestHeader = (req: RequestWithUser) => {
  const bearerToken = req.header("Authorization");
  const token = bearerToken ? bearerToken.replace("Bearer ", "") : "";
  return token;
};

export default authorize;
