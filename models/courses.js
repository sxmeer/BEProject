const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Courses = mongoose.Schema({
    // subName: {
    //     type: String
    // },
    subId: {
        type: Number
    },
    sem: {
        type: Number
    },
    dept: {
        type: Number
    },
    marksType: {
        type: Array
    },
    numberOfModules: {
        type: Number
    },
    moduleDetails: {
        type: Array
    }
});

Courses.plugin(uniqueValidator);
module.exports = mongoose.model("Courses", Courses);
