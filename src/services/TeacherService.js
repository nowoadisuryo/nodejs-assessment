const { extractEmailsFromText } = require('../utils/extract');

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
    this.studentRepository = opts.repositories.studentRepository;
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

  /**
   * Suspend a student
   * @param {string} studentEmail - student's email
   * @returns - no content
   */
  async suspendStudent(studentEmail) {
    return await this.studentRepository.suspendStudent(studentEmail);
  }

  /**
   * Find students to receive notification
   * @param {string} teacher - teacher's email
   * @param {string} notification - notification text
   * @returns {Array<string>} - list of student emails
   */
  async eligibleStudentToReceiveNotif(teacher, notification) {
    // extract student's emails from notification
    const emails = extractEmailsFromText(notification);

    // filter student not suspended and get registered students of a teacher
    const [eligibleEmails, registeredStudentsEmail] = await Promise.all([
      this.studentRepository.findByEmailsNotSuspended(emails),
      this.teacherRepository.findRegisteredStudents(teacher),
    ]);

    // remove duplicate emails
    const uniqueEmails = [
      ...new Set([
        ...eligibleEmails.map((item) => item.email),
        ...registeredStudentsEmail.map((item) => item.email),
      ]),
    ];

    return {
      recipients: uniqueEmails,
    };
  }
}

module.exports = TeacherService;
