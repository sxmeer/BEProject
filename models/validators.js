const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Validators = mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  department: {
    type: Number,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  subjectsAssigned: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

// Validators.plugin(uniqueValidator);
module.exports = mongoose.model("Validators", Validators);
