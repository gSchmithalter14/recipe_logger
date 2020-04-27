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
    owner: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      username: String
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Recipe must belong to a user']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Parent referencing, the parent does not know about its children (steps) so we use:
// Virtual populate
recipeSchema.virtual('steps', {
  ref: 'Step',
  foreignField: 'recipe',
  localField: '_id'
});

recipeSchema.methods.assignedOwner = async function (user) {
  try {
    this.owner.id = user._id;
    this.owner.username = user.username;
    await this.save();
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = mongoose.model('Recipe', recipeSchema);
