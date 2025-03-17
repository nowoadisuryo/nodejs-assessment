/**
 * Teacher Service
 */
class TeacherService {
  /**
   * Constructor
   * @param {object} opts - injected dependencies
   * @param {object} opts.config - config
   * @param {object} opts.logger - logger
   * @param {object} opts.repositories.teacherRepository - teacher repository
   */
  constructor(opts) {
    this.config = opts.config;
    this.logger = opts.logger;
    this.teacherRepository = opts.repositories.teacherRepository;
  }

  /**
   * Register students
   * @param {string} teacherEmail - teacher's email
   * @param {Array<string>} studentEmails - array of student's email
   * @returns - no content
   */
  async registerStudents(teacherEmail, studentEmails) {
    return await this.teacherRepository.registerStudents(
      teacherEmail,
      studentEmails
    );
  }

  /**
   * Find common students registered with list of teachers
   * @param {Array<string>} teacherEmails - array of teacher's email
   * @returns {object} - students email
   */
  async commonStudents(teacherEmails) {
    const result =
      await this.teacherRepository.findCommonStudents(teacherEmails);

    return {
      students: result,
    };
  }
}

module.exports = TeacherService;
