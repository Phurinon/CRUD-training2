const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const { User } = require("./user");

const Employee = sequelize.define("Employee", {
  // Model attributes are defined here
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Employee.belongsTo(User, { foreignKey: "userId" });

module.exports = { Employee };
