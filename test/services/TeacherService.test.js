const TeacherService = require('../../src/services/TeacherService');

describe('TeacherService', function () {
  let opts;
  let clock;
  const sandbox = sinon.createSandbox();
  let teacherService;

  beforeEach(() => {
    clock = sinon.useFakeTimers(new Date('2025-03-16'));

    opts = {
      repositories: {
        teacherRepository: {
          registerStudents: sinon.stub(),
          findCommonStudents: sinon.stub(),
          findRegisteredStudents: sinon.stub(),
        },
        studentRepository: {
          suspendStudent: sinon.stub(),
          findByEmailsNotSuspended: sinon.stub(),
        },
      },
      logger: {
        info: sandbox.stub(),
        error: sandbox.stub(),
      },
    };

    teacherService = new TeacherService(opts);
  });

  afterEach(() => {
    clock.restore();
    sandbox.restore();
  });

  describe('registerStudents', function () {
    it('should call repository method to register students', async function () {
      const teacherEmail = 'teacher@example.com';
      const studentEmails = ['student1@example.com', 'student2@example.com'];
      opts.repositories.teacherRepository.registerStudents.resolves();

      await teacherService.registerStudents(teacherEmail, studentEmails);

      expect(
        opts.repositories.teacherRepository.registerStudents.calledOnceWithExactly(
          teacherEmail,
          studentEmails
        )
      ).to.be.true;
    });
  });

  describe('commonStudents', function () {
    it('should return students registered to all teachers', async function () {
      const teacherEmails = ['teacher1@example.com', 'teacher2@example.com'];
      const students = ['student1@example.com', 'student2@example.com'];
      opts.repositories.teacherRepository.findCommonStudents.resolves(students);

      const result = await teacherService.commonStudents(teacherEmails);

      expect(result).to.deep.equal({ students });
      expect(
        opts.repositories.teacherRepository.findCommonStudents.calledOnceWithExactly(
          teacherEmails
        )
      ).to.be.true;
    });
  });

  describe('suspendStudent', function () {
    it('should call repository method to suspend a student', async function () {
      const studentEmail = 'student@example.com';
      opts.repositories.studentRepository.suspendStudent.resolves();

      await teacherService.suspendStudent(studentEmail);

      expect(
        opts.repositories.studentRepository.suspendStudent.calledOnceWithExactly(
          studentEmail
        )
      ).to.be.true;
    });
  });

  describe('eligibleStudentToReceiveNotif', function () {
    it('should return the list of eligible students', async function () {
      const teacher = 'teacher@example.com';
      const notification = 'Hello @student1@example.com';
      const eligibleEmails = [{ email: 'student1@example.com' }];
      const registeredStudentsEmail = [{ email: 'student3@example.com' }];

      opts.repositories.studentRepository.findByEmailsNotSuspended.resolves(
        eligibleEmails
      );
      opts.repositories.teacherRepository.findRegisteredStudents.resolves(
        registeredStudentsEmail
      );

      const result = await teacherService.eligibleStudentToReceiveNotif(
        teacher,
        notification
      );

      expect(result).to.deep.equal({
        recipients: ['student1@example.com', 'student3@example.com'],
      });
      expect(
        opts.repositories.teacherRepository.findRegisteredStudents.calledOnceWithExactly(
          teacher
        )
      ).to.be.true;
    });

    it('should return the list of eligible students when there are no students mentioned', async function () {
      const teacher = 'teacher@example.com';
      const notification = 'Hello';
      const registeredStudentsEmail = [{ email: 'student3@example.com' }];

      opts.repositories.teacherRepository.findRegisteredStudents.resolves(
        registeredStudentsEmail
      );

      const result = await teacherService.eligibleStudentToReceiveNotif(
        teacher,
        notification
      );

      expect(result).to.deep.equal({
        recipients: ['student3@example.com'],
      });
      expect(
        opts.repositories.teacherRepository.findRegisteredStudents.calledOnceWithExactly(
          teacher
        )
      ).to.be.true;
    });
  });
});
