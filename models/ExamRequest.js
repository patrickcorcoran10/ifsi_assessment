const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ExamRequest extends Model {}

ExamRequest.init(
  {
    request_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'students',
        key: 'student_id',
      },
    },
    course_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    course_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    request_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'Pending'
    },
    needs_accommodation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    notes: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'exam_requests',
  }
);

module.exports = ExamRequest;
