
/*
 * GET home page.
 */
var crypto = require('crypto'),
    path = require('path');

module.exports = function (app) {
  var content = {},
      questions = {},
      answers = {},
      validTests = ['speednews', 'regnews', 'speedhist', 'reghist',
                    'speedfiction', 'regfiction'];
  
  app.get('/', function (req, res) {
    if (!req.cookie.id) {
      var md5 = crypto.createHash('md5');
      md5.update(String(Date.now()) + Math.random());
      res.cookie('id', md5.digest('hex'), { maxAge: 1000 * 60 * 60 * 24 * 7 });
    }
    res.render('index');
  });

  app.get('/:test', function (req, res) {
    var testname = req.params.test;
    if (validTests.index(testname) == -1)
      dealWithError('No such test: ' + testname);

    if (!content[testname] || !questions[testname]) {
      var contentPath = path.join(__dirname, '..', 'data', 'content', testname + '.txt'),
          questionPath = path.join(__dirname, '..', 'data', 'questions', testname + '.txt');

      fs.readFile(contentPath, 'utf8', function (err, testContent) {
        if (err) dealWithError(err);
        content[testname] = testContent;
        fs.readFile(questionPath, 'utf8', function (err, testQuestions) {
          if (err) dealWithError(err);
          testQuestions = testQuestions.split('---');
          questions[testname] = testQuestions;

          res.render('test', { testname: testname, 
            content: content[testname], questions: questions[testname] });
        });
      });
    } else {
      res.render('test', { testname: testname, 
        content: content[testname], questions: questions[testname] });
    }
  }

  app.post('/:test', function (req, res) {
    var testname = req.params.test;
    if (validTests.index(testname) == -1)
      dealWithError('No such test: ' + testname);
    var answers = req.body.answers,
        wpm = req.body.wpm,
        percentCorrect = gradeAnswers(testname, answers);
    // add to database
  });

  function gradeAnswers (testname, answers) {
    if (!answers[testname]) {
      var answerPath = path.join(__dirname, '..', 'data', 'answers', testname + '.txt'),
      fs.readFile(answerPath, 'utf8', function (err, testAnswers) {
        testAnswers = testAnswers.split(' ');
        answers[testname] = testAnswers;
        return grade(answers[testname]);
      });
    } else {
      return grade(answers[testname]);
    }

    function grade (correct) {
      var numCorrect = 0;
      for (var i = 0; i < answers.length; i++) {
        numCorrect += (answers[i] == correct[i]);
      }
      return numCorrect / answers.length;
    }
  }

  app.get('/results', function (req, res) {
    var id = req.cookies.id;
    // deal with database
  });

  function dealWithError (err) {
    console.error(err);
    return res.redirect('/404');
  }
};
