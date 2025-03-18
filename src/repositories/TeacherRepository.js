const { Op, Sequelize } = require('sequelize');
const {
  assert: { throwIfMissing },
} = require('../utils');

/**
 * Teacher Repository
 */
class TeacherRepository {
  /**
   * Constructor
   * @param {object} opts - injected dependencies
   * @param {object} opts.config - config
   * @param {object} opts.logger - logger
   * @param {object} opts.models.teacherModel - teacher model
   * @param {object} opts.models.studentModel - student model
   */
  constructor(opts) {
    this.config = opts.config;
    this.logger = opts.logger;
    this.Teacher = opts.models.teacherModel;
    this.Student = opts.models.studentModel;
  }

  /**
   * Find teacher by email
   * @param {string} email - teacher's email
   * @returns {Sequelize} - Sequelize instance of Teacher
   */
  async findByEmail(email) {
    this.logger.info(`Trying to findOne teacher by email - ${email}`);

    return await this.Teacher.findOne({ where: { email } });
  }

  /**
   * Register students to a teacher
   * @param {string} teacherEmail - teacher's email
   * @param {Array<string>} studentEmails - array of student's email
   * @returns {Sequelize} - Sequelize instance of Teacher
   */
  async registerStudents(teacherEmail, studentEmails) {
    throwIfMissing(teacherEmail, 'teacherEmail');
    throwIfMissing(studentEmails, 'studentEmails');

    const teacher = await this.findByEmail(teacherEmail);
    if (!teacher) {
      this.logger.error('Teacher not found');
      throw new Error('Teacher not found');
    }

    const students = await this.Student.findAll({
      where: { email: studentEmails },
    });
    if (students.length !== studentEmails.length) {
      this.logger.error('Some students not found');
      throw new Error('Some students not found');
    }

    this.logger.info('Trying to register students');
    await teacher.addStudents(students);
    return teacher;
  }

  /**
   * Find teachers within the array
   * @param {Array<string>} teacherEmails - array of teacher's email
   * @returns {object} - array of teacher
   */
  async findTeachersInArray(teacherEmails) {
    this.logger.info(
      `Trying to findAll teachers within the array - ${teacherEmails}`
    );

    return await this.Teacher.findAll({
      where: { email: { [Op.in]: teacherEmails } },
      raw: true,
    });
  }

  /**
   * Find common students registered with list of teachers
   * @param {Array<string>} teacherEmails - array of teacher's email
   * @returns {Array<string>} - array of student's email
   */
  async findCommonStudents(teacherEmails) {
    const teachers = await this.findTeachersInArray(teacherEmails);
    if (teachers.length !== teacherEmails.length) {
      this.logger.error('Some teachers not found');
      throw new Error('Some teachers not found');
    }

    this.logger.info('Trying to find common students');

    const result = await this.Student.findAll({
      attributes: ['email'], // select email column of Student
      include: [
        {
          model: this.Teacher, // JOIN with Teacher
          as: 'teachers',
          attributes: [], // exclude teacher attributes
          where: { email: { [Op.in]: teacherEmails } }, // finds students linked to the given teachers
          through: { attributes: [] }, // excludes unnecessary columns from the join table
        },
      ],
      group: ['Student.email'], // ensures one row per students
      having: Sequelize.literal(
        `COUNT(DISTINCT teachers.email) = ${teacherEmails.length}`
      ), // ensures that each student is linked to exactly all the given teachers
      raw: true,
    });

    // map the result to extract the students email
    return result.map((item) => item.email);
  }

  async findStudentsRegistered(teacherEmail) {
    const teacher = await this.findByEmail(teacherEmail);
    if (!teacher) {
      this.logger.error('Teacher not found');
      throw new Error('Teacher not found');
    }

    const result = await this.Student.findAll({
      attributes: ['email'],
      where: { suspended: false },
      include: [
        {
          model: this.Teacher,
          as: 'teachers',
          attributes: [],
          where: { email: teacherEmail },
          through: { attributes: [] },
        },
      ],
      group: ['Student.email'],
      raw: true,
    });

    return result;
  }
}

module.exports = TeacherRepository;
