const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stepSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  description: {
    type: String,
    required: [true, 'Please add an instruction']
  },
  duration: {
    type: String
  },
  image: {
    type: String
  },
  recipe: {
    type: Schema.ObjectId,
    ref: 'Recipe',
    required: [true, 'Instruction must belong to a recipe']
  }
});

module.exports = mongoose.model('Step', stepSchema);
