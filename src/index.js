import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

// * Trying to connect to Database then exposing the port
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`\n Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("mongo db connection failed!", err);
  });
