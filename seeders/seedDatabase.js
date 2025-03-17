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
    const teacher2 = await Teacher.create({ email: 'teacherjane@gmail.com' });

    // Seed Students
    const student1 = await Student.create({ email: 'student1@example.com' });
    const student2 = await Student.create({ email: 'student2@example.com' });
    const student3 = await Student.create({ email: 'student3@example.com' });

    // Associate Students with Teachers (Many-to-Many Relationship)
    await teacher1.addStudents([student1, student2]);
    await teacher2.addStudents([student2, student3]);

    logger.info('✅ Database seeding completed successfully!');
    process.exit(0); // Exit script after seeding
  } catch (error) {
    logger.error('❌ Error seeding database:', error);
    process.exit(1); // Exit with error
  }
};

seedDatabase();
