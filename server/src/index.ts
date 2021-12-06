import express from "express";
import { PORT, CONN_STRING } from "./config";
import { connectToDB } from "./utils/mongo.util";
import { errorHandler } from "./middleware/error.middleware";
import appRoutes from "./routes/app.routes";
import userRoutes from "./routes/user.routes";
import cors from "cors";

connectToDB(CONN_STRING);

const app = express();

app.use(
  cors({
    origin: ["http://localhost", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accet",
      "token",
      "Authorization",
    ],
  })
);

app.use(express.json());

app.use("/api/app", appRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`--> Server running on port ${PORT}`);
});
