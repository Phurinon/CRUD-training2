const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    username: 'postgres',
    password: process.env.SUPABASE_PASSWORD,
    database: 'postgres',
    host: process.env.SUPABASE_HOST,
    port: 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "postgres",
  },
};