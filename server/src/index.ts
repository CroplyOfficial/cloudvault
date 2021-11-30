import express, { Request, Response } from "express";
import { PORT } from "./config";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.json({
    test: "asdf",
  });
});

app.listen(PORT, () => {
  console.log(`--> Server running on port ${PORT}`);
});
