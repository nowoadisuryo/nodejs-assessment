const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');

// define model definition for Teacher entity
const Teacher = sequelize.define(
  'Teacher',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  { timestamps: true }
);

module.exports = Teacher;
