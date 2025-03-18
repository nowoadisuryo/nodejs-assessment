const {
  assert: { throwIfMissing },
} = require('../utils');

/**
 * Teacher Controller
 */
class TeacherController {
  /**
   * Constructor
   * @param {object} opts - injected dependencies
   * @param {object} opts.config - config
   * @param {object} opts.logger - logger
   * @param {object} opts.services.teacherService - teacher service
   */
  constructor(opts) {
    this.config = opts.config;
    this.logger = opts.logger;
    this.teacherService = opts.services.teacherService;
  }

  /**
   * Register students controller
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - next function
   * @returns - no content
   */
  async registerStudents(req, res, next) {
    try {
      const { teacher, students } = req.body;
      throwIfMissing(teacher, 'teacher');
      throwIfMissing(students, 'students');

      await this.teacherService.registerStudents(teacher, students);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Find common students registered with list of teachers
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - next function
   * @returns {object} - students
   */
  async commonStudents(req, res, next) {
    try {
      const { teacher } = req.query;
      throwIfMissing(teacher, 'teacher');
      const _teacher = Array.isArray(teacher) ? teacher : [teacher];

      const result = await this.teacherService.commonStudents(_teacher);

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async suspendStudent(req, res, next) {
    try {
      const { student } = req.body;
      throwIfMissing(student, 'student');

      await this.teacherService.suspendStudent(student);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TeacherController;
