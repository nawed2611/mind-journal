import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import util from "util";
import connection from "../db.js";

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        connection.connect();
        const query = util.promisify(connection.query).bind(connection);

        const rows = await query(
            `SELECT * FROM user WHERE email = '${email}'`
        );

        if (rows.length > 0) {
            res.status(400).json({ message: "Email already exists" });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            await query(
                `INSERT INTO user (name, email, password) VALUES ('${name}', '${email}', '${hashedPassword}')`
            );
            res.json({ message: "User created" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        connection.connect();
        const query = util.promisify(connection.query).bind(connection);

        const rows = await query(
            `SELECT * FROM user WHERE email = '${email}'`
        );
        if (rows.length > 0) {
            const hashedPassword = rows[0].password;
            const isPasswordCorrect = await bcrypt.compare(
                password,
                hashedPassword
            );
            if (isPasswordCorrect) {
                const token = jwt.sign(
                    { email: rows[0].email },
                    process.env.JWT_SECRET
                );
                res.json({ token });
            } else {
                res.status(400).json({ message: "Wrong password" });
            }
        } else {
            res.status(400).json({ message: "User not found" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.json({ message: "Logout successful" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
