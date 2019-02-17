const mongoose = require('mongoose');
const Models = mongoose.Schema({
    numberOfQuestions: {
        type: Number
    },
    questionModelList: {
        type: Array,
    },
    totalMarks: {
        type: Number,
    }
});

module.exports = mongoose.model("Models", Models);
