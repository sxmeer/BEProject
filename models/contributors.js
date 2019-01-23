const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Contributors = mongoose.Schema({
    name: {
        type: String,
        required:true,
    },
    id: {
        type: Number,
        unique : true
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

Contributors.plugin(uniqueValidator);
module.exports = mongoose.model("Contributors", Contributors);