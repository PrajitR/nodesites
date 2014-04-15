var app = app || {};

app.SubjectView = Backbone.View.extend({
  tagName: 'div',
  className: 'subject-view',

  initialize: function () {
    _.bindAll(this, 'render');
    this.model.bind('change', this.render);
    this.model.bind('reset', this.render);
    this.model.bind('add:nodes', this.renderNode);
  },
  template: _.template($('#subject-view-template').html()),

  render: function () {
    $(this.el).html(this.template(this.model.toJSON()));
  },

  renderNode: function (node) {
    var nodeView = new app.NodeView({ model: node });
    this.$('.node-list').append($(nodeView.render()));
  },

  events: {
    'click .submitButton': 'createNode'
  },

  createNode: function (e) {
    var new_node = app.Node({
      name: this.$('new-node-name').val(),
      description: this.$('new-node-description').val(),
      link: this.$('new-node-link').val(),
      targets: [],
      subject: this.model
    });
    new_node.save();
  }
});
