const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const equipmentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Title is required']
    },
    recipe: {
      type: mongoose.Schema.ObjectId,
      ref: 'Recipe',
      required: [true, 'Equipment must belong to a recipe']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.model('Equipment', equipmentSchema);
