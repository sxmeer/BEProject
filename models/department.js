const mongoose = require('mongoose');

const departmentSchema = mongoose.Schema( {
  deptID: {type: Number, required: true },
  name: { type: String, required: true }
});

module.exports = mongoose.model('department', departmentSchema);
