const mongoose = require('mongoose');

const Semesters = mongoose.Schema({
  semNo: { type: Number, required: true },
  deptID: { type: Number, required: true }
});

module.exports = mongoose.model('Semesters', Semesters);
