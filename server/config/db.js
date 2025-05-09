const config = require("../config1");
const dotenv = require("dotenv");
dotenv.config();
const { Sequelize } = require("sequelize");

// console.log('db config log',config)
// console.log('db config log')
//?pgbouncer=true&connection_limit=1

const sequelize = new Sequelize(`${process.env.SUPABASE_URI}`,
  {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // บางครั้งต้องปิดการตรวจสอบ cert
      },
    },
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

// db_password: process.env.MARIADB_PASSWORD,
//     db_user: process.env.MARIADB_USER,
//     db_db: process.env.MARIADB_DB,
//     db_port: process.env.MARIADB_PORT,
//     db_host: process.env.MARIADB_HOST
