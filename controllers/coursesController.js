const express = require('express');
var router = express.Router();

// const checkAuth = require("./middleware/check-auth");
var { Courses } = require('../models/courses');

router.post('/', (req, res, next) => {
    var courses = new Courses({
        subName: req.body.subName,
        subId: req.body.subId,
        sem: req.body.sem,
        dept: req.body.dept,
        marksType:req.body.marksType.split(","),
        numberOfModules:req.body.numberOfModules,
        moduleDetails:req.body.moduleDetails
    });
    console.log(courses);
    courses.save((err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Courses Save :' + JSON.stringify(err, undefined, 2)); }
    });
});

module.exports = router;