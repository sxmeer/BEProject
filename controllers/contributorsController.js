const express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
var Courses = require('../models/courses');
var Subjects = require('../models/subjects');
var Department = require('../models/departments');

var Questions = require('../models/questions');
var checkAuth = require('./middleware/contributor-check-auth');
var Contributors = require('../models/contributors');

router.post("/login", (req, res, next) => {
    let fetchedUser;
    Contributors.findOne({ id: req.body.id })
        .then(contributors => {
            if (!contributors) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            fetchedUser = contributors;
            return bcrypt.compare(req.body.password, contributors.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            const token = jwt.sign(
                { id: fetchedUser.id, userId: fetchedUser._id },
                "contributor_secret_this_should_be_longer",
                { expiresIn: "1h" }
            );
            res.status(200).json({
                token: token,
                id: fetchedUser.id,
                subjectsAssigned: fetchedUser.subjectsAssigned,
                expiresIn: 3600
            });
        })
        .catch(err => {
            return res.status(401).json({
                message: "Auth failed"
            });
        });
});

router.get('/courseDetail', function (req, res) {
  const id = req.query.id;
  Subjects.find({subID: id})
    .then((data) => {
      const subName = data[0].name;
      const deptId = data[0].deptID;
      Department.find({deptID: deptId})
        .then(deptData => {
          const deptName = deptData[0].name;
          Courses.findOne({ subId: id })
            .then((subjectDetail) => {
              res.status(200).json({
                subName: subName,
                subId: id,
                sem: subjectDetail.sem,
                dept: deptName,
                marksType: subjectDetail.marksType,
                numberOfModules: subjectDetail.numberOfModules,
                moduleDetails: subjectDetail.moduleDetails
            });
          });
        });
    });
});

router.post('/addQuestions', function (req, res) {
    Questions.insertMany(req.body)
    .then((e)=>{
        res.status(201).json({
            msg: 'successfull'
        })
    })
})
// router.post('/', function (req, res) {
//     const name = req.body.name;
//     const id = req.body.email;
//     const subjectsAssigned = req.body.subjectsAssigned;
//     const password = req.body.password;
//     const password2 = req.body.password2;
//     req.checkBody('name', 'Name is required').notEmpty();
//     req.checkBody('subjectsAssigned', 'subject is required').notEmpty();
//     req.checkBody('id', 'Id is required').notEmpty();
//     req.checkBody('password', 'Password is required').notEmpty();
//     req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

//     let errors = req.validationErrors();
//     if (errors) {
//         res.json({
//             err: errors
//         });
//     } else {
//         let contributor = new Contributors({
//             name: name,
//             id: id,
//             subjectsAssigned: subjectsAssigned,
//             password: password
//         });
//         bcrypt.genSalt(10, function (err, salt) {
//             bcrypt.hash(contributor.password, salt, function (err, hash) {
//                 if (err) {
//                     console.log(err);
//                 }
//                 contributor.password = hash;
//                 contributor.save(function (err) {
//                     if (err) {
//                         console.log(err)
//                         res.json({ err: "error" })
//                         return;
//                     } else {
//                         res.json({ msg: "registered" })
//                     }
//                 });
//             });
//         });
//     }
// });

module.exports = router;
