// connection.js
const { Sequelize } = require('sequelize');
require('dotenv').config(); // Loads local .env values when running locally

let sequelize;

// 1. Check if Railway's MySQL URL exists (Production environment)
if (process.env.MYSQL_URL) {
  sequelize = new Sequelize(process.env.MYSQL_URL, {
    dialect: 'mysql',
    logging: false, // Prevents terminal log cluttering in production
  });
} 
// 2. Fall back to separate individual parameters (Local development environment)
else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
    }
  );
}

module.exports = sequelize;