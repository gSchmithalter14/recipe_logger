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
    required: [true, 'Instructions must belong to a recipe']
  },
  createdBy: {
    type: Schema.ObjectId,
    ref: 'User',
    required: [true, 'Instruction must belong to a user']
  }
});

module.exports = mongoose.model('Step', stepSchema);
