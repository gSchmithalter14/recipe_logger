const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stepSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  description: {
    type: String
  },
  duration: {
    type: String
  },
  image: {
    type: String
  }
});

module.exports = mongoose.model('Step', stepSchema);
