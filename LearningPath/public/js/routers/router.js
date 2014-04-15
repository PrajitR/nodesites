var app = app || {};

app.Router = Backbone.Router.extend({
  routes: {
    '': 'showAllSubjects',
    'subject/:id': 'showSubject'
  },

  showAllSubjects: function () {
    var subjects = new App.Subjects();
    var subjectsListView = new App.SubjectsListView({
      el: $('#content'), model: subjects
    });
    subjects.fetch();
  },

  showSubject: function (_id) {
    var subject = new App.Subject({ _id: _id });
    var subjectView = new App.SubjectView({
      el: $('#content'), model: subject
    });
    subject.fetch();
  }
});
