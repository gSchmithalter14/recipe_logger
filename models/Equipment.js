const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const equipmentSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Title is required']
  },
  recipe: {
    type: Schema.ObjectId,
    ref: 'Recipe',
    required: [true, 'Equipment must belong to a recipe']
  },
  createdBy: {
    type: Schema.ObjectId,
    ref: 'User',
    required: [true, 'Equipment must belong to a user']
  }
});

module.exports = mongoose.model('Equipment', equipmentSchema);
