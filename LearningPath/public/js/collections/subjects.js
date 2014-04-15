var app = app || {};

app.Subjects = Backbone.Collections.extend({
  url: '/subject',
  model: app.Subject
});
