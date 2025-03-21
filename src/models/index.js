const Teacher = require('./Teacher');
const Student = require('./Student');

// define relationship many-to-many between Teacher and Student
Teacher.belongsToMany(Student, {
  through: 'Teacher_Student',
  as: 'students',
  foreignKey: 'TeacherId',
});
Student.belongsToMany(Teacher, {
  through: 'Teacher_Student',
  as: 'teachers',
  foreignKey: 'StudentId',
});

module.exports = { Teacher, Student };
