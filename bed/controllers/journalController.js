import util from "util";
import connection from "../db.js";

const findMultiple = async (req, res) => {
    connection.connect();
    const query = util.promisify(connection.query).bind(connection);

    const rows = await query(`SELECT * FROM journals`);

    res.send(rows);
}

const findOne = async (req, res) => {
    connection.connect();
    const query = util.promisify(connection.query).bind(connection);

    const rows = await query(`SELECT * FROM journals WHERE user_id = '${req.params.id}'`);

    res.send(rows);
}

const createOne = async (req, res) => {
    connection.connect();
    const query = util.promisify(connection.query).bind(connection);

    const rows = await query(`INSERT INTO journals (title, content, date, user_id) VALUES ('${req.body.title}', '${req.body.content}', '${req.body.date}', '${req.body.user_id}')`);

    res.send(rows);
}

const updateOne = async (req, res) => {
    connection.connect();
    const query = util.promisify(connection.query).bind(connection);

    const rows = await query(`UPDATE journal SET title = '${req.body.title}', content = '${req.body.content}', date = '${req.body.date}' WHERE id = ${req.params.id} `);

    res.send(rows);
}

const deleteOne = async (req, res) => {
    connection.connect();
    const query = util.promisify(connection.query).bind(connection);

    const rows = await query(`DELETE FROM journal WHERE id = ${req.params.id} `);

    res.send(rows);
}

export default {
    findMultiple,
    findOne,
    createOne,
    updateOne,
    deleteOne
}
