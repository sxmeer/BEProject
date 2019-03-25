const mongoose = require('mongoose');

const Status = mongoose.Schema({
  subjectID: {
    type: Number,
    required: true
  },
  contributor: {
    type: Number,
    required: true,
    default: 0
  },
  validator: {
    type: Number,
    required: true,
    default: 0
  }
});

module.exports = mongoose.model('Status', Status);
