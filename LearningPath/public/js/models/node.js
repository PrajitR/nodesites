var app = app || {};

app.Node = Backbone.Model.extend({
  defaults: {
    name: 'No Name',
    link: '',
    description: 'No description provided',
    targets: []
  },
  idAttribute: '_id',

  addTarget: function (targetId) {
    this.targets.push(targetId);
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
