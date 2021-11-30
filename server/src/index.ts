import express, { Request, Response } from "express";
import { PORT, CONN_STRING } from "./config";
import { connectToDB } from "./utils/mongo";
import appRoutes from "./routes/app.routes";
import { errorHandler } from "./middleware/error.middleware";

connectToDB(CONN_STRING);

const app = express();

app.use("/api/app", appRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`--> Server running on port ${PORT}`);
});
