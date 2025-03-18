const StudentRepository = require('../../src/repositories/StudentRepository');

describe('StudentRepository', () => {
  let opts;
  let clock;
  let studentRepository;
  const sandbox = sinon.createSandbox();
  const students = [
    { id: 1, email: 'student1@gmail.com', suspended: false },
    { id: 2, email: 'student2@gmail.com', suspended: false },
  ];
  const inputStudents = ['student1@gmail.com', 'student3@gmail.com'];
  const inputStudent = 'student1@gmail.com';

  beforeEach(() => {
    clock = sinon.useFakeTimers(new Date('2025-03-16'));

    opts = {
      models: {
        studentModel: {
          findOne: sandbox.stub(),
          findAll: sandbox.stub(),
        },
      },
      logger: {
        info: sandbox.stub(),
        error: sandbox.stub(),
      },
    };

    studentRepository = new StudentRepository(opts);
  });

  afterEach(() => {
    clock.restore();
    sandbox.restore();
  });

  describe('#suspendStudent', () => {
    it('should throw error when student not found', async () => {
      opts.models.studentModel.findOne.resolves(null);

      const actual = studentRepository.suspendStudent(inputStudent);

      await expect(actual).to.eventually.rejectedWith(Error);
    });

    it('should throw error when student was already suspended', async () => {
      opts.models.studentModel.findOne.resolves({ suspended: true });

      const actual = studentRepository.suspendStudent(inputStudent);

      await expect(actual).to.eventually.rejectedWith(Error);
    });

    it('should success suspend a student', async () => {
      opts.models.studentModel.findOne.resolves({
        suspended: false,
        update: sinon.stub(),
        save: sinon.stub(),
      });

      const actual = await studentRepository.suspendStudent(inputStudent);

      expect(actual.update).to.be.calledOnce;
      expect(actual.save).to.be.calledOnce;
    });
  });

  describe('#findByEmailsNotSuspended', () => {
    it('should find unsuspend students', async () => {
      opts.models.studentModel.findAll.resolves(students);

      const actual =
        await studentRepository.findByEmailsNotSuspended(inputStudents);

      expect(actual).to.be.an('array');
      expect(actual).to.have.lengthOf(2);
    });
  });
});
