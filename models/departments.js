const mongoose = require("mongoose");
const Departments = mongoose.Schema({
  deptID: { type: Number, required: true },
  name: { type: String, required: true }
});

module.exports = mongoose.model("Departments", Departments);
