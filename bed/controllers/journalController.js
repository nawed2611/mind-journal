import util from "util";
import connection from "../db.js"; // Make sure this import is done correctly

const findMultiple = async (req, res) => {
  connection.connect();
  const query = util.promisify(connection.query).bind(connection);

  try {
    const rows = await query(`SELECT * FROM journal`);
    console.log(rows);
    res.send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const findOne = async (req, res) => {
  connection.connect();
  const query = util.promisify(connection.query).bind(connection);

  try {
    const rows = await query(
      `SELECT * FROM journal WHERE id = '${req.params.id}'`,
    );
    res.send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const create = async (req, res) => {
  const query = `INSERT INTO journal (title, content, date, user) VALUES (?, ?, ?, ?)`;
  const date = new Date().toISOString().slice(0, 10);
  const values = [req.body.title, req.body.content, req.body.date, req.body.id];

  try {
    connection.connect();
    const [result] = await connection.promise().query(query, values);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const update = async (req, res) => {
  const query = `UPDATE journal SET title = ?, content = ? WHERE user = ?`;
  const values = [req.body.title, req.body.content, req.params.id];

  try {
    const [result] = (await connection).execute(query, values);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const deleteOne = async (req, res) => {
  const query = util.promisify(connection.query).bind(connection);

  try {
    const rows = await query(
      `DELETE FROM journal WHERE id = ${req.params.id} `,
    );
    res.send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export default {
  findMultiple,
  findOne,
  create,
  update,
  deleteOne,
};
