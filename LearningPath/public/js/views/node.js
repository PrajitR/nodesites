var app = app || {};

app.NodeView = Backbone.View.extend({
  tagName: 'div'
  className: 'node-view',
  initialize: function () {
    _.bindAll(this, 'render');
    this.model.bind('change', this.render);
  },

  template: _.template($('#node-view-template').html()),

  render: function () {
    return $(this.el).html(this.template(this.model.toJSON()));
  }
});
