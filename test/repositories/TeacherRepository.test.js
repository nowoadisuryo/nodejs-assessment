const TeacherRepository = require('../../src/repositories/TeacherRepository');
const { MissingValueError } = require('../../src/utils/assert');

describe('TeacherRepository', () => {
  let opts;
  let clock;
  let teacherRepository;
  const sandbox = sinon.createSandbox();
  const teachers = [
    { id: 1, email: 'teacher1@gmail.com' },
    { id: 2, email: 'teacher2@gmail.com' },
  ];
  const students = [
    { id: 1, email: 'student1@gmail.com', suspended: false },
    { id: 2, email: 'student2@gmail.com', suspended: false },
  ];
  const inputTeacher = 'teacher1@gmail.com';
  const inputStudents = ['student1@gmail.com', 'student3@gmail.com'];

  beforeEach(() => {
    clock = sinon.useFakeTimers(new Date('2025-03-16'));

    opts = {
      models: {
        teacherModel: {
          findOne: sandbox.stub(),
          addStudents: sandbox.stub(),
        },
        studentModel: {
          findAll: sandbox.stub(),
        },
      },
      logger: {
        info: sandbox.stub(),
        error: sandbox.stub(),
      },
    };

    teacherRepository = new TeacherRepository(opts);
  });

  afterEach(() => {
    clock.restore();
    sandbox.restore();
  });

  describe('#registerStudents', () => {
    it('should throw error when teacherEmail is missing', async () => {
      const actual = teacherRepository.registerStudents();

      await expect(actual).to.eventually.rejectedWith(MissingValueError);
    });

    it('should throw error when studentEmails is missing', async () => {
      const actual = teacherRepository.registerStudents(inputTeacher);

      await expect(actual).to.eventually.rejectedWith(MissingValueError);
    });

    it('should throw error when teacher is not found', async () => {
      opts.models.teacherModel.findOne.resolves(null);

      const actual = teacherRepository.registerStudents(
        inputTeacher,
        inputStudents
      );

      await expect(actual).to.eventually.rejectedWith(Error);
    });

    it('should throw error when some students not found', async () => {
      opts.models.teacherModel.findOne.resolves(teachers[0]);
      opts.models.studentModel.findAll.resolves(() =>
        students.filter((item) => inputStudents.includes(item))
      );

      const actual = teacherRepository.registerStudents(
        inputTeacher,
        inputStudents
      );

      await expect(actual).to.eventually.rejectedWith(Error);
    });

    it('should success register students', async () => {
      opts.models.teacherModel.findOne.resolves({
        addStudents: sinon.stub(),
      });
      opts.models.studentModel.findAll.resolves(students);

      const actual = await teacherRepository.registerStudents(
        inputStudents,
        inputStudents
      );

      expect(actual.addStudents).to.be.calledOnce;
    });
  });
});
