const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');

// define model definition for Student entity
const Student = sequelize.define(
  'Student',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    suspended: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['email'],
      },
    ],
  }
);

module.exports = Student;
