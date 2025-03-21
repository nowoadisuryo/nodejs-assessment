const { createContainer, asClass, asValue, asFunction } = require('awilix');

const StudentRepository = require('../repositories/StudentRepository');
const TeacherRepository = require('../repositories/TeacherRepository');
const TeacherService = require('../services/TeacherService');
const TeacherController = require('../controllers/TeacherController');
const { Teacher, Student } = require('../models');
const config = require('./index');
const { logger } = require('../utils');

const container = createContainer();

// register utils, models, repositories, controllers, and services for dependecy injection
container.register({
  config: asValue(config),
  logger: asValue(logger),
  teacherModel: asValue(Teacher),
  studentModel: asValue(Student),
  teacherRepository: asClass(TeacherRepository).singleton(),
  studentRepository: asClass(StudentRepository).singleton(),
  teacherController: asClass(TeacherController).singleton(),
  teacherService: asClass(TeacherService).singleton(),
});

// seperate models, repositories, controllers, and services into different fields
container.register({
  models: asFunction(({ teacherModel, studentModel }) => ({
    teacherModel,
    studentModel,
  })).singleton(),
  repositories: asFunction(({ teacherRepository, studentRepository }) => ({
    teacherRepository,
    studentRepository,
  })).singleton(),
  controllers: asFunction(({ teacherController }) => ({
    teacherController,
  })).singleton(),
  services: asFunction(({ teacherService }) => ({
    teacherService,
  })).singleton(),
});

module.exports = container;
