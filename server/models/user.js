const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const { Role } = require("./role");

const User = sequelize.define("User", {
  // Model attributes are defined her
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

User.belongsTo(Role, { foreignKey: "roleId" });

module.exports = { User };
