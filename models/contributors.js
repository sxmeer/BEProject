const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');
const Contributors = mongoose.Schema({
    id: {
      type: Number,
      required: true
    },
    name: {
        type: String,
        required:true,
    },
    email: {
        type: String,
        unique : true,
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
        required:true,
    },
    password: {
        type: String,
        required:true,
    }
});

// Contributors.plugin(uniqueValidator);
module.exports = mongoose.model("Contributors", Contributors);
