const TeacherController = require('../../src/controllers/TeacherController');

describe('TeacherController', () => {
  let opts;
  let clock;
  const sandbox = sinon.createSandbox();
  let teacherController;
  let req, res, next;

  beforeEach(() => {
    clock = sinon.useFakeTimers(new Date('2025-03-16'));

    opts = {
      services: {
        teacherService: {
          registerStudents: sinon.stub(),
          commonStudents: sinon.stub(),
          suspendStudent: sinon.stub(),
          eligibleStudentToReceiveNotif: sinon.stub(),
        },
      },
      logger: {
        info: sandbox.stub(),
        error: sandbox.stub(),
      },
    };

    teacherController = new TeacherController(opts);

    req = {};
    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };
    next = sinon.stub();
  });

  afterEach(() => {
    clock.restore();
    sandbox.restore();
  });

  describe('#registerStudents', () => {
    it('should register students and return 204', async () => {
      req.body = {
        teacher: 'teacher@example.com',
        students: ['student@example.com'],
      };

      await teacherController.registerStudents(req, res, next);

      expect(
        opts.services.teacherService.registerStudents.calledOnceWith(
          'teacher@example.com',
          ['student@example.com']
        )
      ).to.be.true;
      expect(res.status.calledWith(204)).to.be.true;
      expect(res.send.calledOnce).to.be.true;
    });

    it('should call next with error if teacher or students are missing', async () => {
      req.body = {};

      await teacherController.registerStudents(req, res, next);

      expect(next.calledOnce).to.be.true;
    });
  });

  describe('commonStudents', () => {
    it('should return common students', async () => {
      req.query = { teacher: 'teacher@example.com' };
      opts.services.teacherService.commonStudents.resolves([
        'student@example.com',
      ]);

      await teacherController.commonStudents(req, res, next);

      expect(
        opts.services.teacherService.commonStudents.calledOnceWith([
          'teacher@example.com',
        ])
      ).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith(['student@example.com'])).to.be.true;
    });
  });

  describe('suspendStudent', () => {
    it('should suspend a student and return 204', async () => {
      req.body = { student: 'student@example.com' };

      await teacherController.suspendStudent(req, res, next);

      expect(
        opts.services.teacherService.suspendStudent.calledOnceWith(
          'student@example.com'
        )
      ).to.be.true;
      expect(res.status.calledWith(204)).to.be.true;
      expect(res.send.calledOnce).to.be.true;
    });
  });

  describe('eligibleStudentToReceiveNotif', () => {
    it('should return eligible students', async () => {
      req.body = {
        teacher: 'teacher@example.com',
        notification: 'Hello @student@example.com',
      };
      opts.services.teacherService.eligibleStudentToReceiveNotif.resolves([
        'student@example.com',
      ]);

      await teacherController.eligibleStudentToReceiveNotif(req, res, next);

      expect(
        opts.services.teacherService.eligibleStudentToReceiveNotif.calledOnceWith(
          'teacher@example.com',
          'Hello @student@example.com'
        )
      ).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith(['student@example.com'])).to.be.true;
    });
  });
});
