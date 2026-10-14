// connection.js
const { Sequelize } = require('sequelize');

// Load the local .env variables
require('dotenv').config(); 

let sequelize;

// 1. ALWAYS check for the cloud environment variable first
if (process.env.PRODUCTION_DB_URL) {
  console.log('--- SYSTEM DETECTED PRODUCTION_DB_URL: CONNECTING TO CLOUD DB ---');
  sequelize = new Sequelize(process.env.PRODUCTION_DB_URL, {
    dialect: 'mysql',
    logging: false,
  });
} 
// 2. FALLBACK to local settings only if the cloud variable is completely missing
else {
  console.log('--- CLOUD VARIABLE NOT FOUND: CONNECTING TO LOCAL DB ---');
  sequelize = new Sequelize(
    process.env.DB_NAME || 'ifsi_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'password',
    {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
    }
  );
}

module.exports = sequelize;
