const mongoose = require('mongoose');

const semesterSchema = mongoose.Schema({
  semNo: { type: Number, required: true },
  deptID: { type: Number, required: true }
});

module.exports = mongoose.model('semester', semesterSchema);
