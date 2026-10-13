const Student = require('./Student');
const ExamRequest = require('./ExamRequest');


Student.hasMany(ExamRequest, {
  foreignKey: 'student_id',
  onDelete: 'CASCADE'
});

ExamRequest.belongsTo(Student, {
  foreignKey: 'student_id'
});

module.exports = {Student, ExamRequest}