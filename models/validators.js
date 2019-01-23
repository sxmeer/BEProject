const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Validators = mongoose.Schema({
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

Validators.plugin(uniqueValidator);
module.exports = mongoose.model("Validators", Validators);
