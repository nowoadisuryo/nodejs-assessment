const { Sequelize } = require('sequelize');

const {
  db: { dbName, dbUser, dbPass, dbHost },
} = require('./index');

const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
