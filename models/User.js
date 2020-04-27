const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required']
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    passwordConfirm: {
      type: String
      // validate: {
      //   validator: function(value) {
      //     return value === this.password;
      //   },
      //   message: 'Passwords are not the same'
      // },
      // required: [true, 'Please confirm your password']
    },
    passwordChangedAt: Date,
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.pre('save', async function (next) {
  // only run if password was modified
  if (!this.isModified('password')) return next();

  //hashing password and delete passwordConfirm
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;

  next();
});

//instance methods
userSchema.methods.matchPassword = async function (
  enteredPassword,
  userPassword
) {
  return await bcrypt.compare(enteredPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(JWTTimestamp, changedTimeStamp);

    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

//Virtual populate recipe data to User Model
userSchema.virtual('recipes', {
  ref: 'Recipe',
  foreignField: 'createdBy',
  localField: '_id'
});

// userSchema.methods.addedRecipe = async function (recipeId) {
//   try {
//     if (this.recipes.indexOf(recipeId) !== -1) {
//       return false;
//     }
//     this.recipes.push(recipeId);
//     await this.save();
//     return true;
//   } catch (err) {
//     console.log(err);
//     return false;
//   }
// };

// userSchema.methods.removedRecipe = async function (recipeId) {
//   try {
//     if (this.recipes.indexOf(recipeId) === -1) {
//       return false;
//     }
//     this.recipes.splice(this.recipes.indexOf(this._id), 1);
//     await this.save();
//     return true;
//   } catch (err) {
//     console.log(err);
//     return false;
//   }
// };

module.exports = mongoose.model('User', userSchema);
