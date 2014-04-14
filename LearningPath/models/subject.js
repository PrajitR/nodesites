var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Subject = new Schema({
  name: String,
  path: Schema.Types.Mixed
});

module.exports = mongoose.model('Subject', Subject);
