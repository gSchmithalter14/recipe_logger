const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');

const recipeSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [40, 'Recipe name must have less or equal than 40 characters'],
    validate: {
      validator: function (value) {
        return validator.isAlpha(value.split(' ').join(''));
      },
      message: 'Tour name must only contain letters.'
    }
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [
      200,
      'A recipe description must have less or equal than 200 characters'
    ]
  },
  duration: {
    type: String
  },
  image: {
    type: String
  },
  owner: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  steps: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Step'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);
