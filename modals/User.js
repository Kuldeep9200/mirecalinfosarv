const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
   
    
  });
  const User = mongoose.model('enquri', UserSchema);
  module.exports = User;