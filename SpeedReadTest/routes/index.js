var crypto = require('crypto'),
    path = require('path'),
    db = require('../db'),
    pg = require('pg').native,
    fs = require('fs');

module.exports = function (app) {
  var content = {},
      questions = {},
      answers = {},
      validTests = ['speedfiction', 'regfiction'];
  
  app.get('/', function (req, res) {
    if (!(req.cookie && req.cookie.id)) {
      var md5 = crypto.createHash('md5');
      md5.update(String(Date.now()) + Math.random());
      var digest = md5.digest('hex');
      res.cookie('id', digest, { maxAge: 1000 * 60 * 60 * 24 * 7 });

      pg.connect(db, function (err, client, done) {
        if(err) return dealWithError('Postgres error: ' + err, res);
        client.query('INSERT INTO speedread (user_id) VALUES ($1)',
          [digest], function (err, result) {
            if(err) return dealWithError('Postgres error: ' + err, res);
            done();
            res.render('index'); 
          });
      });
    } else {
      res.render('index');
    }
  });

  app.get('/test/:test', function (req, res) {
    var testname = req.params.test;
    if (validTests.indexOf(testname) == -1)
      dealWithError('No such test: ' + testname, res);

    if (!content[testname] || !questions[testname]) {
      var contentPath = path.join(__dirname, '..', 'data', 'content', testname + '.txt'),
          questionPath = path.join(__dirname, '..', 'data', 'questions', testname + '.txt');

      fs.readFile(contentPath, 'utf8', function (err, testContent) {
        if (err) dealWithError(err, res);
        content[testname] = testContent;
        fs.readFile(questionPath, 'utf8', function (err, testQuestions) {
          if (err) dealWithError(err, res);
          testQuestions = testQuestions.split('\n\n');
          questions[testname] = testQuestions;

          res.render('test', { testname: testname, 
            content: content[testname], questions: questions[testname] });
        });
      });
    } else {
      res.render('test', { testname: testname, 
        content: content[testname], questions: questions[testname] });
    }
  });

  app.post('/test/:test', function (req, res) {
    var testname = req.params.test;
    if (validTests.indexOf(testname) == -1)
      dealWithError('No such test: ' + testname, res);
    var answers = [],
        wpm = Math.min(Math.round(Number(req.body.wpm)), 32767);
    for (var i = 0; i < 5; i++) {
      answers[i] = req.body['q' + i];
    }
    var percentCorrect = gradeAnswers(testname, answers);
    // add to database
    pg.connect(db, function (err, client, done) {
      if(err) return dealWithError('Postgres error: ' + err, res);
      client.query('UPDATE speedread SET ' + testname + ' = ($1), wpm_' +
        testname + ' = ($2) WHERE user_id = ($3)',
        [percentCorrect, wpm, req.cookies.id], function (err, result) {
          if(err) return dealWithError('Postgres error: ' + err, res);
          done();
          if (testname == 'speedfiction') {
            res.redirect('/test/regfiction');
          } else {
            res.redirect('/results');
          }
        });
    });
  });

  function gradeAnswers (testname, userAnswers) {
    if (!answers[testname]) {
      var answerPath = path.join(__dirname, '..', 'data', 'answers', testname + '.txt'),
      testAnswers = fs.readFileSync(answerPath, 'utf8'); // sync is simpler
      testAnswers = testAnswers.split(' ');
      answers[testname] = testAnswers;
    }
    return grade(answers[testname]);

    function grade (correct) {
      var numCorrect = 0;
      for (var i = 0; i < userAnswers.length; i++) {
        console.log(userAnswers[i] + ' vs. ' + correct[i]);
        numCorrect += (userAnswers[i] == correct[i].trim());
      }
      console.log(numCorrect);
      return 100 * numCorrect / userAnswers.length;
    }
  }

  app.get('/results', function (req, res) {
    // deal with database
    pg.connect(db, function (err, client, done) {
      if (err) return dealWithError('Postgres error: ' + err, res);
      client.query('SELECT * FROM speedread WHERE user_id = ($1)',
        [req.cookies.id], function (err, result) {
          if (err) return dealWithError('Postgres error: ' + err, res);
          done();
          res.render('results', { user: result.rows[0] });
        });
    });
  });

  app.get('/404', function (req, res) {
    res.end('Something went wrong. Sorry!');
  });

  function dealWithError (err, res) {
    console.error(err);
    return res.redirect('/404');
  }
};
