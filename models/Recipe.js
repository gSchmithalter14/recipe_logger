const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');

const recipeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [40, 'Recipe name must have less or equal than 40 characters'],
      validate: {
        validator: function (value) {
          return validator.isAlpha(value.split(' ').join(''));
        },
        message: 'Recipe name must only contain letters.'
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
    createdBy: {
      type: Schema.ObjectId,
      ref: 'User',
      required: [true, 'Recipe must belong to a user']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    likes: [
      {
        type: Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Cascade delete steps, equipment, ingredients when recipe is deleted
recipeSchema.pre('remove', async function (next) {
  await this.model('Step').deleteMany({ recipe: this._id });
  await this.model('Equipment').deleteMany({ recipe: this._id });
  await this.model('Ingredient').deleteMany({ recipe: this._id });
  next();
});

// Parent referencing, the parent does not know about its children (step) so we use:
// Virtual populate
recipeSchema.virtual('steps', {
  ref: 'Step',
  foreignField: 'recipe',
  localField: '_id'
});

recipeSchema.virtual('equipment', {
  ref: 'Equipment',
  foreignField: 'recipe',
  localField: '_id'
});

recipeSchema.virtual('ingredients', {
  ref: 'Ingredient',
  foreignField: 'recipe',
  localField: '_id'
});

// Query middleware
recipeSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'createdBy',
    select: 'username'
  });

  // .populate('likes');

  next();
});

module.exports = mongoose.model('Recipe', recipeSchema);

// move query middleware to controller????
