// connection.js
const { Sequelize } = require('sequelize');
require('dotenv').config(); 

let sequelize;

if (process.env.PORT || process.env.RAILWAY_ENVIRONMENT) {
  console.log('--- SYSTEM FORCING PRODUCTION CONNECTION TO RAILWAY MYSQL ---');
  
  sequelize = new Sequelize(
    'railway',
    'root',
    'QBCKxLjanavgtZWmzhQLnkDNXNBXCDGL',
    {
      host: 'switchyard.proxy.rlwy.net', 
      port: 25415,
      dialect: 'mysql',
      logging: false,
      // ADD THIS BLOCK TO FIX THE PROTOCOL_CONNECTION_LOST ERROR
      dialectOptions: {
        ssl: {
          rejectUnauthorized: false // Required for Railway's public proxy connections
        }
      }
    }
  );
} else {
  console.log('--- SYSTEM CONNECTING TO LOCAL DB ---');
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
