const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const RoomsSchema = new Schema({
  name: {type: String, index: true, unique: true, dropDups: true},
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'user',
    index: true,
  },
  hash: String,
  salt: String,
  questions: [{
      name: String,
      imageUrl: String
  }]
});

RoomsSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

RoomsSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};


// Maybe I'll get to use this if i generate a click join
// RoomsSchema.methods.generateJWT = function() {
//   const today = new Date();
//   const expirationDate = new Date(today);
//   expirationDate.setDate(today.getDate() + 60);

//   return jwt.sign({
//     username: this.username,
//     id: this._id,
//     exp: parseInt(expirationDate.getTime() / 1000, 10),
//   }, 'secret');
// }

RoomsSchema.methods.toAuthJSON = function() {
  return {
    ...this.toJSON(),
    hash: undefined,
    salt: undefined,
  };
};

module.exports.Room = mongoose.model('room', RoomsSchema);