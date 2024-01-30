const { Pool } = require("pg");
const {
  db_password,
  db_host,
  db_name,
  db_port,
  db_user,
} = require("./config/config");

const pool = new Pool({
  user: db_user,
  host: db_host,
  database: db_name,
  password: db_password,
  port: db_port,
});

module.exports = pool;
