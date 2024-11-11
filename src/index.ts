import employeeRouter from "./routes/employee.routes";
import bodyParser from "body-parser";
import express from "express";
import "reflect-metadata";
import loggerMiddleware from "./middleware/logger.middleware";
import dataSource from "./db/data-source.db";
import errorMiddleware from "./middleware/errorMiddleware";
import departmentRouter from "./routes/department.routes";

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(loggerMiddleware);
app.use("/employee", employeeRouter);
app.use("/department", departmentRouter);
app.use(errorMiddleware);

(async () => {
  try {
    await dataSource.initialize();
  } catch (e) {
    console.log("Failed to connect to db", e);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log("server listening to 3001");
  });
})();
