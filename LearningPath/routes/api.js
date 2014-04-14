var Subject = require('../models/subject');

module.exports = function apiRoutes (app) {
  app.get('/subject', function (req, res) {
    Subject.find({}, function (err, subjects) {
      if (err) return dealWithError(err, res);
      res.json(subjects);
    });
  });

  app.post('/subject', function (req, res) {
    var name = req.body.name;
    var subject = new Subject({ name: name });
    subject.save(function (err, subject) {
      if (err) return dealWithError(err, res);
      res.json(subject.toObject());
    });
  });

  app.get('/subject/:id', function (req, res) {
    var id = req.params.id;
    Subject.findById(id, function (err, subject) {
      if (!subject) {
        res.json(404, { error: 'Could not find subject with id: ' + id });
      } else if (err) {
        return dealWithError(err, res);
      } else {
        res.json(subject);
      }
    });
  });

  app.put('/subject/:id', function (req, res) {
    var id = req.body.id,
        path = req.body.path;
    Subject.findById(id, function (err, subject) {
      if (!subject) {
        res.json(404, { error: 'Could not find subject with id: ' + id });
      } else if (err) {
        return dealWithError(err, res);
      } else {
        subject.path = path;
        subject.markModified('path');
        subject.save(function (err, subject) {
          if (err) return dealWithError(err, res);
          res.json(subject.toObject());
        });
      }
    });
  });

  function dealWithError (err, res, statusCode) {
    console.error(err);
    statusCode = statusCode || 500;
    res.json(statusCode, { error: 'There was an error' });
  }
};
