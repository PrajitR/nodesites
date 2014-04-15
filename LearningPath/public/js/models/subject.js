var app = app || {};

app.Subject = Backbone.RelationalModel.extend({
  urlRoot: '/subject',
  idAttribute: '_id',
  relations: [{
    type: Backbone.HasMany,
    key: 'nodes',
    relatedModel: 'app.Node',
    reverseRelation: {
      key: 'subject',
      includeInJSON: '_id'
    }
  }]
});

