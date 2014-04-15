var app = app || {};

app.SubjectsListView = Backbone.View.extend({
  tagName: 'div',
  className: 'subject-list-view',

  initialize: function () {
    _.bindAll(this, 'render');
    this.model.on('change', this.render);
    this.model.on('reset', this.render);
    this.model.on('add', this.render);
  },

  render: function () {

