const pool = require('../config/db');

exports.findByUserName = async (user_name) => {
  const [rows] = await pool.query("SELECT * FROM tbl_user WHERE user_name = ?", [user_name]);
  return rows[0];
};

exports.create = async (department, username, hashedPassword) => {
  await pool.query("INSERT INTO tbl_user (Name, user_name, password) VALUES (?, ?, ?)", [department, username, hashedPassword]);
};
