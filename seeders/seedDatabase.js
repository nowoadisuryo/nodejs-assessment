const sequelize = require('../src/config/database');
const { Teacher, Student } = require('../src/models');
const logger = require('../src/utils/logger');

const seedDatabase = async () => {
  try {
    logger.info('🚀 Seeding database...');

    // Sync and reset database (auto-create tables if they don't exist)
    await sequelize.sync({ force: true });

    // Seed Teachers
    const teacher1 = await Teacher.create({ email: 'teacherken@gmail.com' });
    const teacher2 = await Teacher.create({ email: 'teacherjoe@gmail.com' });

    // Seed Students
    await Student.create({ email: 'studentjon@gmail.com' });
    await Student.create({ email: 'studenthon@gmail.com' });
    const student3 = await Student.create({
      email: 'commonstudent1@gmail.com',
    });
    const student4 = await Student.create({
      email: 'commonstudent2@gmail.com',
    });
    const student5 = await Student.create({
      email: 'student_only_under_teacher_ken@gmail.com',
    });
    await Student.create({ email: 'studentagnes@gmail.com' });
    await Student.create({ email: 'studentmiche@gmail.com' });
    const student8 = await Student.create({ email: 'studentbob@gmail.com' });
    await Student.create({ email: 'studentmary@gmail.com' });

    // Associate Students with Teachers (Many-to-Many Relationship)
    await teacher1.addStudents([student3, student4, student5, student8]);
    await teacher2.addStudents([student3, student4]);

    logger.info('✅ Database seeding completed successfully!');
    process.exit(0); // Exit script after seeding
  } catch (error) {
    logger.error('❌ Error seeding database:', error);
    process.exit(1); // Exit with error
  }
};

seedDatabase();
