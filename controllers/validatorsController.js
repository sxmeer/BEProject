const express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
var Courses = require('../models/courses');
var Subjects = require('../models/subjects');
var Department = require('../models/departments');
var Questions = require('../models/questions');
var Validators = require('../models/validators');

router.post("/login", (req, res, next) => {
    let fetchedUser;
    Validators.findOne({ id: req.body.id })
        .then(validator => {
            if (!validator) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            fetchedUser = validator;
            return bcrypt.compare(req.body.password, validator.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            const token = jwt.sign(
                { id: fetchedUser.id, userId: fetchedUser._id },
                "validator_secret_this_should_be_longer",
                { expiresIn: "1h" }
            );
            res.status(200).json({
                // token: token,
                // expiresIn: 3600
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
    Subjects.find({ subID: id })
        .then((data) => {
            const subName = data[0].name;
            const deptId = data[0].deptID;
            Department.find({ deptID: deptId })
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
router.get('/getRandomQuestion/:id',(req,res)=>{
    console.log(req.params.id);
    Questions.aggregate([
      {$match:{
        subjectID:parseInt(req.params.id),
        isValid:0
      }},
      {$sample:{size:3}}
    ]).then((docs)=>{
      res.status(200).json(docs);
    })
    // Questions.find({subjectID:req.params.id}).limit(3).then((docs)=>{
    //     //random docs and query needs to be changed
    //     res.status(200).json(docs);
    // })
});

router.get('/markAsValidQuestion/:id',(req,res)=>{
    Questions.findOneAndUpdate(
        {
            _id:req.params.id
        },
        {
            $set:{
                isValid:1
            }
        }
    ).then((docs)=>{
        res.status(200).json({
            msg:'successfull'
        })
    })
})

router.get('/markAsInvalidQuestion/:id',(req,res)=>{
    Questions.findOneAndUpdate(
        {
            _id:req.params.id
        },
        {
            $set:{
                isValid:-1
            }
        }
    ).then((docs)=>{
        res.status(200).json({
            msg:'successfull'
        })
    })
})

module.exports = router;
