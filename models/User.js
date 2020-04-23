const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Password confirm is required'],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: 'Passwords are not the same'
    }
  },
  recipes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    }
  ],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  next();
});

module.exports = mongoose.model('User', userSchema);
