var app = app || {};

app.Node = Backbone.RelationalModel.extend({
  defaults: {
    name: 'No Name',
    link: '',
    description: 'No description provided',
    targets: []
  },
  urlRoot: '/node',
  idAttribute: '_id',

  addTarget: function (targetId) {
    var targets = this.get('targets');
    targets.push(targetId);
    this.set('targets', targets);
  }
});

/*
 * [
 * { id: 1, name: 'HTML basics', link: 'http://google.com', 
 *   description: 'Basic building block of web', targets: [2, 4, 9]
 * }
 * 
 *
 */
