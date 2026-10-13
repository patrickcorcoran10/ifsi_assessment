const Sequelize = require('sequelize');
require('dotenv').config();

const requiredProductionSettings = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const missingProductionSettings = process.env.NODE_ENV === 'production'
  ? requiredProductionSettings.filter((setting) => !process.env[setting])
  : [];

if (missingProductionSettings.length > 0) {
  throw new Error(
    `Missing required production database settings: ${missingProductionSettings.join(', ')}`
  );
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: Number(process.env.DB_PORT || 3306)
  }
);

module.exports = sequelize;