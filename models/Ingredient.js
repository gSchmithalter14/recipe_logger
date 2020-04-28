const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ingredientSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Ingredient is required']
    },
    recipe: {
      type: mongoose.Schema.ObjectId,
      ref: 'Recipe',
      required: [true, 'Ingredient must belong to a recipe']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.model('Ingredient', ingredientSchema);
