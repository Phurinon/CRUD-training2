const config = require("../config1");
const dotenv = require("dotenv");
dotenv.config();
const { Sequelize } = require("sequelize");

// console.log('db config log',config)
// console.log('db config log')
//?pgbouncer=true&connection_limit=1

const sequelize = new Sequelize(
  process.env.SUPABASE_DB,
  process.env.SUPABASE_USER,
  process.env.SUPABASE_PASSWORD,
  {
    host: process.env.SUPABASE_HOST,
    port: process.env.SUPABASE_PORT,
    dialect: "postgres",
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to Supabase PostgreSQL successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { sequelize, connectDB };
