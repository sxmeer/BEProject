const mongoose = require('mongoose');
const Questions = mongoose.Schema({
    module: {
        type: Number,
    },
    question: {
        type: String,
    },
    marks: {
        type: Number,
    },
    difficulty: {
        type: Number,
    },
    cognitive: {
        type: Number,
    },
    subjectID: {
        type: Number,
    },
    contributorID:{
        type: Number
    },
    isValid:{
        type: Number,
        default: 0
    },
    asked:{
        type: Number,
        default: 0
    },
    checked:{
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("Questions", Questions);
// questionID,module,question,marks,difficulty,cognitive,subjectID,contributorID,isValid,asked,checked