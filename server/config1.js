const dotenv = require("dotenv");

dotenv.config();

const config = {
  db_password: process.env.MARIADB_PASSWORD,
  db_user: process.env.MARIADB_USER,
  db_db: process.env.MARIADB_DB,
  db_port: process.env.MARIADB_PORT,
  db_host: process.env.MARIADB_HOST,
};

module.exports = { config };
