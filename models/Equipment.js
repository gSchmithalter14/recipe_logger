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
  }
});

module.exports = mongoose.model('Equipment', equipmentSchema);
