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
    this.logger.info(
      `[TeacherRepository] Trying to findOne teacher by email - ${email}`
    );

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

    // if a teacher is not found, then throw an error
    if (!teacher) {
      this.logger.error('Teacher is not found');
      throw new Error('Teacher is not found');
    }

    const students = await this.Student.findAll({
      where: { email: studentEmails },
    });

    // if some students are not found, then throw an error
    if (students.length !== studentEmails.length) {
      this.logger.error('Some students are not found');
      throw new Error('Some students are not found');
    }

    this.logger.info('[TeacherRepository] Trying to register students');

    // register students
    await teacher.addStudents(students);
    return teacher;
  }

  /**
   * Find teachers
   * @param {Array<string>} teacherEmails - array of teacher's email
   * @returns {object} - array of teacher
   */
  async findTeachers(teacherEmails) {
    this.logger.info(
      `[TeacherRepository] Trying to findAll teachers - ${teacherEmails}`
    );

    return await this.Teacher.findAll({
      where: { email: { [Op.in]: teacherEmails } }, // find by array of techer's email
      raw: true, // return as an object
    });
  }

  /**
   * Find common students registered with list of teachers
   * @param {Array<string>} teacherEmails - array of teacher's email
   * @returns {Array<string>} - array of student's email
   */
  async findCommonStudents(teacherEmails) {
    const teachers = await this.findTeachers(teacherEmails);

    // if some teachers are not found, then throw an error
    if (teachers.length !== teacherEmails.length) {
      this.logger.error('Some teachers are not found');
      throw new Error('Some teachers are not found');
    }

    this.logger.info('[TeacherRepository] Trying to find common students');

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
      raw: true, // return as an object
    });

    // map the result to extract the students email
    return result.map((item) => item.email);
  }

  /**
   * Find registered students of a teacher
   * @param {string} teacherEmail - teacher's email
   * @returns {Array<object>} - list of student emails
   */
  async findRegisteredStudents(teacherEmail) {
    const teacher = await this.findByEmail(teacherEmail);

    // if a teacher is not found, then throw an error
    if (!teacher) {
      this.logger.error('Teacher is not found');
      throw new Error('Teacher is not found');
    }

    this.logger.info('[TeacherRepository] Trying to find registered students');

    const result = await this.Student.findAll({
      attributes: ['email'], // select field email
      where: { suspended: false }, // find unsuspended students
      include: [
        {
          model: this.Teacher, // JOIN with Teacher
          as: 'teachers',
          attributes: [], // excludes all attributes from Teacher
          where: { email: teacherEmail }, // find by teacher's email
          through: { attributes: [] }, // excludes unnecessary columns from the join table
        },
      ],
      group: ['Student.email'], // ensures one row per students
      raw: true, // return as an object
    });

    return result;
  }
}

module.exports = TeacherRepository;
