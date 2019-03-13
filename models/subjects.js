const mongoose = require('mongoose');

const Subjects = mongoose.Schema({
  subID: { type: Number, required: true },
  semNo: { type: Number, required: true },
  deptID: { type: Number, required: true },
  name: { type: String, required: true }
});

module.exports = mongoose.model('Subjects', Subjects);
