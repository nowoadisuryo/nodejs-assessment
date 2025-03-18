const { Op } = require('sequelize');

/**
 * Student Repository
 */
class StudentRepository {
  /**
   * Constructor
   * @param {object} opts - injected dependencies
   * @param {object} opts.config - config
   * @param {object} opts.logger - logger
   * @param {object} opts.models.studentModel - student model
   */
  constructor(opts) {
    this.config = opts.config;
    this.logger = opts.logger;
    this.Student = opts.models.studentModel;
  }

  /**
   * Find student by email
   * @param {string} email - teacher's email
   * @returns {Sequelize} - Sequelize instance of Teacher
   */
  async findByEmail(email) {
    this.logger.info(`Trying to findOne student by email - ${email}`);

    return await this.Student.findOne({ where: { email } });
  }

  async suspendStudent(studentEmail) {
    const student = await this.findByEmail(studentEmail);
    if (!student) {
      this.logger.error('Student not found');
      throw new Error('Student not found');
    }

    if (student.suspended === true) {
      this.logger.error('Student was already suspended');
      throw new Error('Student was already suspended');
    }

    await student.update({ suspended: true });
    await student.save();
    return student;
  }

  async findByEmailsNotSuspended(emails) {
    this.logger.info(
      `Trying to findAll student by email and not suspended - ${emails}`
    );

    return await this.Student.findAll({
      attributes: ['email'],
      where: { email: { [Op.in]: emails }, suspended: false },
      raw: true,
    });
  }
}

module.exports = StudentRepository;
