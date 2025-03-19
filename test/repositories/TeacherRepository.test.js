const { MissingValueError, NotFoundError } = require('../../src/errors');
const TeacherRepository = require('../../src/repositories/TeacherRepository');

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
          findAll: sandbox.stub(),
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

      await expect(actual).to.eventually.rejectedWith(NotFoundError);
    });

    function filterStudents(students, inputStudents) {
      return students.filter((item) => inputStudents.includes(item));
    }

    it('should throw error when some students not found', async () => {
      opts.models.teacherModel.findOne.resolves(teachers[0]);
      opts.models.studentModel.findAll.resolves(() =>
        filterStudents(students, inputStudents)
      );

      const actual = teacherRepository.registerStudents(
        inputTeacher,
        inputStudents
      );

      await expect(actual).to.eventually.rejectedWith(NotFoundError);
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

  describe('#findCommonStudents', () => {
    it('should throw error when some teachers not found', async () => {
      opts.models.teacherModel.findAll.resolves(['']);

      const actual = teacherRepository.findCommonStudents(teachers);

      await expect(actual).to.eventually.rejectedWith(NotFoundError);
    });

    it('should success find common students', async () => {
      opts.models.teacherModel.findAll.resolves(['', '']);
      opts.models.studentModel.findAll.resolves(students);

      const actual = await teacherRepository.findCommonStudents(teachers);

      expect(actual).to.be.an('array');
      expect(actual).to.have.lengthOf(2);
    });
  });

  describe('#findRegisteredStudents', () => {
    it('should throw error when a teacher not found', async () => {
      opts.models.teacherModel.findOne.resolves(null);

      const actual = teacherRepository.findRegisteredStudents(inputTeacher);

      await expect(actual).to.eventually.rejectedWith(NotFoundError);
    });

    it('should success find registered students', async () => {
      opts.models.teacherModel.findOne.resolves({});
      opts.models.studentModel.findAll.resolves(students);

      const actual =
        await teacherRepository.findRegisteredStudents(inputTeacher);

      expect(actual).to.be.an('array');
      expect(actual).to.have.lengthOf(2);
    });
  });
});
