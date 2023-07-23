import util from "util";
import connection from "../db.js";

export const findMultiple = async (req, res) => {
  connection.connect();
  const query = util.promisify(connection.query).bind(connection);

  const rows = await query(`SELECT * FROM user`);

  res.send(rows);
};
