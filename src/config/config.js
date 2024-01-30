const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: process.env.PORT,
  db_password: process.env.DB_PASSWORD,
  db_user: process.env.DB_USER,
  db_port: process.env.DB_PORT,
  db_host: process.env.DB_HOST,
  db_name: process.env.DB_NAME,
};
