import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false,
    },
});

export default connection;