const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

//name, email, photo, password, passwordConfirm
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Username required.'],
    // unique: true,
    // minlength: [3, 'Min 3 chars!'],
    // maxlength: [15, 'Max 15 chars!'],
  },
  email: {
    type: String,
    required: [true, 'E-mail required.'],
    validate: [validator.isEmail, 'Wrong e-mail format'],
    unique: true,
    lowercase: true,
  },
  photo: { type: String, default: 'default.jpg' },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    requird: [true, 'Password required'],
    minlength: [8],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  //Only run if password is modified
  if (!this.isModified('password')) return next();

  if (process.env.DO_ENCRYPT === 'false') return next();
  //Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  //this point to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
