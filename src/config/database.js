const { Sequelize } = require('sequelize');

const {
  db: { dbName, dbUser, dbPass, dbHost, dbPort },
} = require('./index');

// create a database connection
const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
