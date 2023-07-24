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

    console.log(req.body);

    const rows = await query(`INSERT INTO journals (title, content, date, user_id) VALUES ('How to build a journalling app', '<p>How to build a journalling app</p><p></p><ul class="not-prose pl-2" data-type="taskList"><li class="flex items-start my-4" data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>I want to build this</p></div></li><li class="flex items-start my-4" data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>I want to build that</p></div></li></ul><p>this is working</p>', 'Monday, July 24, 2023', 'user_2NUhlCNSHVtPNV53TAqLs2qtX7Z');
    `);

    res.send(rows);
}

const updateOne = async (req, res) => {
    connection.connect();
    const query = util.promisify(connection.query).bind(connection);

    const rows = await query(`UPDATE journal SET title = '${req.body.title}', content = '${req.body.content}', date = '${req.body.date}' WHERE id = ${req.params.id}`);

    res.send(rows);
}

const deleteOne = async (req, res) => {
    connection.connect();
    const query = util.promisify(connection.query).bind(connection);

    const rows = await query(`DELETE FROM journal WHERE id = ${req.params.id}`);

    res.send(rows);
}

export default {
    findMultiple,
    findOne,
    createOne,
    updateOne,
    deleteOne
}
