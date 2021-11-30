import express, { Request, Response } from "express";
import { PORT, CONN_STRING } from "./config";
import { connectToDB } from "./utils/mongo";

connectToDB(CONN_STRING);

const app = express();

app.listen(PORT, () => {
  console.log(`--> Server running on port ${PORT}`);
});
