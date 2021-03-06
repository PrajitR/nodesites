var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var User = new Schema({
  id: String,
  name: String,
  exercises: [
    { name: String,
      reps:  Number ,
      date:  Date ,
      family: String
    } ]
});

module.exports = mongoose.model('User', User);
