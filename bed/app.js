import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mysql from "mysql2/index.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";

const app = express();

app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

try {
  const connection = mysql.createConnection(process.env.DATABASE_URL);
  connection.connect();
}
catch (err) {
  console.log(err);
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
