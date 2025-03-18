const { Sequelize } = require('sequelize');

const {
  db: { dbName, dbUser, dbPass, dbHost, dbPort },
} = require('./index');

const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
