const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

 class Student extends Model {}
 
 Student.init(
  {
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    fireDepartment: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: false
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'students',
  }
);

module.exports = Student;