// connection.js
const { Sequelize } = require('sequelize');
require('dotenv').config(); 

let sequelize;

// If we are in production on Railway, force connection parameters directly
if (process.env.PORT || process.env.RAILWAY_ENVIRONMENT) {
  console.log('--- SYSTEM FORCING PRODUCTION CONNECTION TO RAILWAY MYSQL ---');
  
  sequelize = new Sequelize(
    'railway',                          // Database Name
    'root',                             // Username
    'QBCKxLjanavgtZWmzhQLnkDNXNBXCDGL', // Password (stripped of quotes)
    {
      // Using Railway's standard external proxy domain to guarantee connection
      host: 'viaduct.proxy.rlwy.net', 
      port: 25415, // IMPORTANT: Change this to your database's public/proxy port if it is different
      dialect: 'mysql',
      logging: false,
    }
  );
} 
// Local Fallback
else {
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
