import express, { Request, Response } from "express";
import { PORT, CONN_STRING } from "./config";
import { connectToDB } from "./utils/mongo";
import appRoutes from "./routes/app.routes";

connectToDB(CONN_STRING);

const app = express();

app.use("/api/app", appRoutes);

app.listen(PORT, () => {
  console.log(`--> Server running on port ${PORT}`);
});
