var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Node = new Schema({ 
  name: String,
  description: String
  link: String,
  targets: [Number]
});

module.exports = mongoose.model('Node', Node);
