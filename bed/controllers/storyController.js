import util from "util";
import connection from "../db.js";

const findOne = async (req, res) => {
  connection.connect();
  const query = util.promisify(connection.query).bind(connection);

  try {
    const rows = await query(`SELECT * FROM journal where user = '${req.params.id}'`);
    console.log(rows);
    res.send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

const create = async (req, res) => {
  connection.connect();
  const query = util.promisify(connection.query).bind(connection);

  const rows = await query(
    `INSERT INTO journal (title, content, date, user, imageURL) VALUES ('${req.body.title}', '${req.body.content}', '${req.body.date}', '${req.body.id}', '${req.body.imageURL}')`,
  );

  res.send(rows);
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

export default {
  findOne,
  create,
  update,
  findMultiple
};
