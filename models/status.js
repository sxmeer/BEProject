const mongoose = require('mongoose');

const Status = mongoose.Schema({
  subjectID: {
    type: Number,
    unique: true,
    required: true
  },
  contributor: {
    type: Number,
    default: 0
  },
  validator: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Status', Status);
