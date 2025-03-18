const express = require('express');

module.exports = (container) => {
  const router = express.Router();
  const controllers = container.resolve('controllers');

  router.post('/register', (req, res, next) =>
    controllers.teacherController.registerStudents(req, res, next)
  );

  router.get('/commonstudents', (req, res, next) =>
    controllers.teacherController.commonStudents(req, res, next)
  );

  router.post('/suspend', (req, res, next) =>
    controllers.teacherController.suspendStudent(req, res, next)
  );

  return router;
};
