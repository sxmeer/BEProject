const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require('../models/admin');
var Validators = require('../models/validators');
var Contributors = require('../models/contributors');
var Courses = require('../models/courses');
var Models = require('../models/models');
var checkAuth = require('./middleware/admin-check-auth');

router.post("/login", (req, res, next) => {
    let fetchedUser;
    Admin.findOne({ id: req.body.id })
        //id: req.body.id
        .then(admin => {
            if (!admin) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            fetchedUser = admin;
            return bcrypt.compare(req.body.password, admin.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            const token = jwt.sign(
                { id: fetchedUser.id, userId: fetchedUser._id },
                "admin_secret_this_should_be_longer",
                { expiresIn: "1h" }
            );
            res.status(200).json({
                token: token,
                expiresIn: 3600
            });
        })
        .catch(err => {
            return res.status(401).json({
                message: "Auth failed"
            });
        });
});


router.post("/homepage/addvalidators", checkAuth, (req, res, next) => {
    const name = req.body.name;
    const id = req.body.id;
    const subjectsAssigned = req.body.subjectsAssigned;
    const password = req.body.password;
    const password2 = req.body.password2;
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('subjectsAssigned', 'subject is required').notEmpty();
    req.checkBody('id', 'Id is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();
    if (errors) {
        res.json({
            err: errors
        });
    } else {
        bcrypt.hash(password, 10)
            .then(hash => {
                const validator = new Validators({
                    name: name,
                    id: id,
                    subjectsAssigned: subjectsAssigned,
                    password: hash
                });
                validator
                    .save()
                    .then(result => {
                        res.status(201).json({
                            message: "validator created!",
                            result: result
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        });
                    });
            })
    }
});

router.post('/homepage/addcontributors', checkAuth, function (req, res) {
    const name = req.body.name;
    const id = req.body.id;
    const subjectsAssigned = req.body.subjectsAssigned;
    const password = req.body.password;
    const password2 = req.body.password2;
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('subjectsAssigned', 'subject is required').notEmpty();
    req.checkBody('id', 'Id is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();
    if (errors) {
        res.json({
            err: errors
        });
    } else {
        let contributor = new Contributors({
            name: name,
            id: id,
            subjectsAssigned: subjectsAssigned,
            password: password
        });
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(contributor.password, salt, function (err, hash) {
                if (err) {
                    console.log(err);
                }
                contributor.password = hash;
                contributor.save(function (err) {
                    if (err) {
                        console.log(err)
                        res.json({ err: "error" })
                        return;
                    } else {
                        res.json({ msg: "registered" })
                    }
                });
            });
        });
    }
});

router.get('/homepage/getContributors', checkAuth, (req, res, next) => {
    console.log("hit end point")
    Contributors.find()
        .then((contributors) => {
            res.status(201).json(contributors);
        })
})

router.post('/homepage/addmodel', checkAuth,(req,res,next)=>{
    console.log("hit")
})

router.post('/homepage/addcourses', checkAuth, (req, res, next) => {
    var courses = new Courses({
        subName: req.body.subName,
        subId: req.body.subId,
        sem: req.body.sem,
        dept: req.body.dept,
        marksType: req.body.marksType.split(","),
        numberOfModules: req.body.numberOfModules,
        moduleDetails: req.body.moduleDetails
    });
    console.log(courses);
    courses.save((err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Courses Save :' + JSON.stringify(err, undefined, 2)); }
    });
});



module.exports = router;
