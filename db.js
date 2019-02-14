const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://db_admin:yOtcZBpNTZNG7vy2@cluster0-yy7ek.mongodb.net/qpg?retryWrites=true',{ useNewUrlParser: true }, (err) => {
    if (!err)
        console.log('MongoDB connection succeeded.');
    else
        console.log('Error in DB connection : ' + JSON.stringify(err, undefined, 2));
});

module.exports = mongoose;
