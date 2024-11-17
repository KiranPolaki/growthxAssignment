import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));

import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";

// * Any request that comes to below routes api/v1/user will be sent to specific routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);

export { app };
