const { exec, escape } = require('../db/mysql');
const { genPassword } = require('../utils/cryp');

const login = async (username, password) => {
  password = genPassword(password);
  password = escape(password);
  let sql = `SELECT * from tg_users WHERE username=${escape(username)} AND password=${password}`;
  const loginResult = await exec(sql);
  return loginResult[0] || {};
}

module.exports = {
  login
}