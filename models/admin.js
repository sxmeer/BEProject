const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Admin = mongoose.Schema({
    id: {
        type: Number,
        unique : true
    },
    password: {
        type: String,
        required:true,
    }
});

Admin.plugin(uniqueValidator);
module.exports = mongoose.model("Admin", Admin);