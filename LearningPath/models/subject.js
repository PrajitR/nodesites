var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Node = require('./node');

var Subject = new Schema({
  name: String,
  path: [ Node ]
});

module.exports = mongoose.model('Subject', Subject);
