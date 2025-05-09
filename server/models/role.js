const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const { User } = require("./user");

const Role = sequelize.define("Role", {
  // Model attributes are defined here
  Role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = { Role };
