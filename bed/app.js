import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mysql from "mysql2";

import userRoutes from "./routes/user.js";
import journalRoutes from "./routes/journal.js";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

try {
  const connection = mysql.createConnection(process.env.DATABASE_URL);
  connection.connect();
  console.log("Connected to database");
} catch (err) {
  console.log(err);
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.use("/user", userRoutes);
app.use("/journal", journalRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
