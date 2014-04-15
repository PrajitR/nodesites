var app = app || {};

app.SubjectsListView = Backbone.View.extend({
  tagName: 'div',
  className: 'subject-list-view',

  initialize: function () {
    _.bindAll(this, 'render');
    this.model.on('change', this.render);
    this.model.on('reset', this.render);
    this.model.on('add', this.renderSubject);
  },
  template: _.template($('#subjects-list-template').html()),

  render: function () {
    $(this.el).html(this.template());
   this.model.forEach(this.renderSubject);
   return $(this.el).html();
  },

  renderSubject: function (subject) {
    var subjectView = app.SubjectSummaryView({ model: subject });
    this.$('ul.subjects-list').prepend($(subjectView.render()));
  },

  events: {
    'click .submitButton': 'createSubject'
  },

  createSubject: function (e) {
    var subject = new app.Subject({ name: $('.new-subject-name').val() });
    subject.save({}, { success: this.onSubjectCreated });
  },

  onSubjectCreated: function (subject, res) {
    this.model.add(subject, { at: 0 });
  }
});

app.SubjectSummaryView = Backbone.View.extend({

