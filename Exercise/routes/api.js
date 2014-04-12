var User = require('../models/user'),
    crypto = require('crypto');

module.exports = function api (app) {
  app.get('/users', function (req, res) {
    User.find({}, function (err, users) {
      if (err) return dealWithError('Mongo Error (get /users): ' + err, res, 404);
      res.json(users);
    });
  });

  app.post('/users', function (req, res) {
    var id = createId(),
        user = new User({ id: id, name: req.body.name, exercises: [] } );
    user.save(function (err, user) {
      if (err) return dealWithError('Mongo Error (post /users): ' + err, res, 404);
      res.json(user.toObject());
    });
  });

  app.get('/users/:id', function (req, res) {
    User.find({ id: req.params.id }, function (err, user) {
      if (err) return dealWithError('Mongo Error (get /users:id): ' + err, res, 404);
      res.json(user);
    });
  });

  app.put('/users/:id', function (req, res) {
    var name = req.body.name,
        reps = +req.body.reps,
        date = new Date(req.body.date),
        family = req.body.family;
    var exercise = {name: name, reps: reps, date: date, family: family };
    console.dir(exercise);
    User.update({ id: req.body.id }, { $push: { 'exercises': exercise }}, { upsert: true },
      function (err, num, raw) {
        if (err) console.error(err);
        res.json({ 'success': 200 });
      });
  });

  app.delete('/users/:id', function (req, res) {
    User.remove({ id: req.params.id }, function (err) {
      if (err) console.error(err); 
      res.json({ 'deleted': 200 });
    });
  });

  function createId () {
    var md5 = crypto.createHash('md5');
    md5.update('' + Date.now());
    md5.update('' + (Math.random() * 1000));
    return md5.digest('hex');
  }

  function dealWithError (err, res, statusCode) {
    console.error(err);
    statusCode = statusCode || 500;
    res.send(statusCode);
  }
};
