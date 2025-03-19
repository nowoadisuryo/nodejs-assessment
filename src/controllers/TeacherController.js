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
   * Register students
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

      // if input teacher is not an array, then convert it to an array
      const _teacher = Array.isArray(teacher) ? teacher : [teacher];

      const result = await this.teacherService.commonStudents(_teacher);

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Suspend a student
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - next function
   * @returns - no content
   */
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

  /**
   * Find students to receive notification
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - next function
   * @returns {Array<string>} - list of student emails
   */
  async eligibleStudentToReceiveNotif(req, res, next) {
    try {
      const { teacher, notification } = req.body;
      throwIfMissing(teacher, 'teacher');
      throwIfMissing(notification, 'notification');

      const result = await this.teacherService.eligibleStudentToReceiveNotif(
        teacher,
        notification
      );

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TeacherController;
