import util from "util";
import connection from "../db.js";

const findMultiple = async (req, res) => {
    connection.connect();
    const query = util.promisify(connection.query).bind(connection);

    const rows = await query(`SELECT * FROM journal`);
    console.log(rows);

    res.send(rows);
}

const findOne = async (req, res) => {
    connection.connect();
    const query = util.promisify(connection.query).bind(connection);

    const rows = await query(`SELECT * FROM journal WHERE id = '${req.params.id}'`);

    res.send(rows);
}

const create = async (req, res) => {
    connection.connect();
    console.log("req", req.body);
    const query = util.promisify(connection.query).bind(connection);

    const rows = await query(`INSERT INTO journal (title, content, date, id) VALUES ('${req.body.title}', '${req.body.content}', '${req.body.date}', '${req.body.id}')`);

    res.send(rows);
}

const update = async (req, res) => {
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
    create,
    update,
    deleteOne
}
