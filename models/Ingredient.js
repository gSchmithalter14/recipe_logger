const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Ingredient is required']
  },
  recipe: {
    type: Schema.ObjectId,
    ref: 'Recipe',
    required: [true, 'Ingredient must belong to a recipe']
  },
  createdBy: {
    type: Schema.ObjectId,
    ref: 'User',
    required: [true, 'Ingredient must belong to a user']
  }
});

module.exports = mongoose.model('Ingredient', ingredientSchema);
