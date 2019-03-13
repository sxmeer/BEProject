const express = require('express');
var router = express.Router();

// const checkAuth = require("./middleware/check-auth");
var { Courses } = require('../models/courses');
const Departments = require('../models/departments');
const Semesters = require('../models/semesters');
const Subjects = require('../models/subjects');

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

router.get('/departments', (req,res,next) => {
  Departments.find()
    .then(departments => {
      res.status(200).json(departments);
    });
});

router.get("/semesters", (req, res, next) => {
  const deptID = req.query.deptID;
  Semesters.find({ deptID }).then(semesters => {
    res.status(200).json(semesters);
  });
});

router.get("/subjects", (req, res, next) => {
  const deptID = req.query.deptID;
  const semNo = req.query.semNo;
  Subjects.find({ semNo, deptID }).then(subjects => {
    res.status(200).json(subjects);
  });
});

module.exports = router;
