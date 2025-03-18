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
}

module.exports = StudentRepository;
