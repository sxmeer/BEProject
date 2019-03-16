const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generator = require("generate-password");
const nodemailer = require("nodemailer");
const Admin = require("../models/admin");
const Departments = require("../models/departments");
const Subjects = require("../models/subjects");
var Validators = require("../models/validators");
var Contributors = require("../models/contributors");
var Courses = require("../models/courses");
var Models = require("../models/models");
var checkAuth = require("./middleware/admin-check-auth");
var Model = require('../models/models');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "wtlminiproject84@gmail.com",
    pass: "wtlminiproject"
  }
});

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
//   const name = req.body.name;
//   const id = req.body.id;
//   const subjectsAssigned = req.body.subjectsAssigned;
//   const password = req.body.password;
//   const password2 = req.body.password2;
//   req.checkBody("name", "Name is required").notEmpty();
//   req.checkBody("subjectsAssigned", "subject is required").notEmpty();
//   req.checkBody("id", "Id is required").notEmpty();
//   req.checkBody("password", "Password is required").notEmpty();
//   req
//     .checkBody("password2", "Passwords do not match")
//     .equals(req.body.password);

//   let errors = req.validationErrors();
//   if (errors) {
//     res.json({
//       err: errors
//     });
//   } else {
//     bcrypt.hash(password, 10).then(hash => {
//       const validator = new Validators({
//         name: name,
//         id: id,
//         subjectsAssigned: subjectsAssigned,
//         password: hash
//       });
//       validator
//         .save()
//         .then(result => {
//           res.status(201).json({
//             message: "validator created!",
//             result: result
//           });
//         })
//         .catch(err => {
//           res.status(500).json({
//             error: err
//           });
//         });
//     });
//   }
// });

// router.get("/homepage/addcontributors", (req, res) => {
//   Contributors.find()
//     .sort({ id: -1 })
//     .limit(1)
//     .then(data => {
//       // console.log(data);
//       res.status(200).json(data);
//     });

const name = req.body.name;
  const email = req.body.email;
  const subId = req.body.subId;
  const dept = req.body.dept;
  const sem = req.body.sem;
  // const password = req.body.password;
  // const password2 = req.body.password2;
  req.checkBody("name", "Name is required").notEmpty();
  req.checkBody("subId", "Subject is required").notEmpty();
  req.checkBody("email", "Email is required").notEmpty();
  req.checkBody("dept", "Department is required").notEmpty();
  req.checkBody("sem", "Semester is required");
  // req.checkBody('id', 'Id is required').notEmpty();
  // req.checkBody('password', 'Password is required').notEmpty();
  // req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();
  if (errors) {
    res.json({
      err: errors
    });
  } else {
    Validators.find()
      .sort({ id: -1 })
      .limit(1)
      .then(data => {
        const newID = parseInt(data[0].id) + 1;
        // console.log(data);
        let validator = new Validators({
          id: newID,
          name: name,
          email: email,
          subjectsAssigned: subId,
          department: dept,
          semester: sem,
          password: generator.generate({
            length: 10,
            numbers: true
          })
        });
        const genPass = validator.password;
        // console.log('Password: '+contributor.password);
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(validator.password, salt, function(err, hash) {
            if (err) {
              console.log(err);
            }
            validator.password = hash;
            validator.save(function(err) {
              if (err) {
                console.log(err);
                res.json({ err: "error" });
                return;
              } else {
                res.json({ msg: "registered" });
              }
            });
          });
          // console.log(contributor);
          //Sending Mail
          Departments.find({ deptID: validator.department }).then(data => {
            const deptName = data[0].name;
            Subjects.find({ subID: validator.subjectsAssigned }).then(
              subData => {
                const subName = subData[0].name;
                const html = `
                <h1 style="color: blue; text-align: center;">Question Paper Generator</h1>
                <br><br>
                <h3>Hello ${ validator.name },</h3>
                <h3>Congratulations!, you have been appointed as validator for subject ${ subName } - ${ deptName }.</h3>
                <h3>You can login to qpg.com using the credentials given below.</h3>
                <br><br>
                <h4 style="color: red">User ID: <span style="color: purple">${ validator.id }</span></h4>
                <br>
                <h4 style="color: red">Password: <span style="color: purple">${ genPass }</span></h4>
                <br>`;
                const mailOptions = {
                  from: "wtlminiproject84@gmail.com",
                  to: validator.email,
                  subject: "QPG: Validator Login Credentials",
                  html: html
                };
                transporter.sendMail(mailOptions, function(error, info) {
                  if (error) {
                    console.log(error);
                    // res.status(404).json({ msg: "Failed to send mail" });
                  } else {
                    console.log("Email sent: " + info.response);
                    // res.status(200).json({ msg: info.response });
                  }
                });
              }
            );
          });
        });
      });
  }

});

router.post("/homepage/addcontributors", checkAuth, function(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const subId = req.body.subId;
  const dept = req.body.dept;
  const sem = req.body.sem;
  // const password = req.body.password;
  // const password2 = req.body.password2;
  req.checkBody("name", "Name is required").notEmpty();
  req.checkBody("subId", "Subject is required").notEmpty();
  req.checkBody("email", "Email is required").notEmpty();
  req.checkBody("dept", "Department is required").notEmpty();
  req.checkBody("sem", "Semester is required");
  // req.checkBody('id', 'Id is required').notEmpty();
  // req.checkBody('password', 'Password is required').notEmpty();
  // req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();
  if (errors) {
    res.json({
      err: errors
    });
  } else {
    Contributors.find()
      .sort({ id: -1 })
      .limit(1)
      .then(data => {
        const newID = parseInt(data[0].id) + 1;
        // console.log(data);
        let contributor = new Contributors({
          id: newID,
          name: name,
          email: email,
          subjectsAssigned: subId,
          department: dept,
          semester: sem,
          password: generator.generate({
            length: 10,
            numbers: true
          })
        });
        const genPass = contributor.password;
        // console.log('Password: '+contributor.password);
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(contributor.password, salt, function(err, hash) {
            if (err) {
              console.log(err);
            }
            contributor.password = hash;
            contributor.save(function(err) {
              if (err) {
                console.log(err);
                res.json({ err: "error" });
                return;
              } else {
                Departments.find({ deptID: contributor.department }).then(data => {
                  const deptName = data[0].name;
                  Subjects.find({ subID: contributor.subjectsAssigned }).then(
                    subData => {
                      const subName = subData[0].name;
                      const html = `
                      <h1 style="color: blue; text-align: center;">Question Paper Generator</h1>
                      <br><br>
                      <h3>Hello ${ contributor.name },</h3>
                      <h3>Congratulations!, you have been appointed as contributor for subject ${ subName } - ${ deptName }.</h3>
                      <h3>You can login to qpg.com using the credentials given below.</h3>
                      <br><br>
                      <h4 style="color: red">User ID: <span style="color: purple">${ contributor.id }</span></h4>
                      <br>
                      <h4 style="color: red">Password: <span style="color: purple">${ genPass }</span></h4>
                      <br>`;
                      const mailOptions = {
                        from: "wtlminiproject84@gmail.com",
                        to: contributor.email,
                        subject: "QPG: Contributor Login Credentials",
                        html: html
                      };
                      transporter.sendMail(mailOptions, function(error, info) {
                        if (error) {
                          console.log(error);
                          // res.status(404).json({ msg: "Failed to send mail" });
                        } else {
                          console.log("Email sent: " + info.response);
                          // res.status(200).json({ msg: info.response });
                        }
                      });
                    }
                  );
                });
                res.json({ msg: "registered" });
              }
            });
          });
          // console.log(contributor);
          //Sending Mail
        });
      });
  }
});

router.get("/homepage/getContributors", checkAuth, (req, res, next) => {
  console.log("hit end point");
  Contributors.find().then(contributors => {
    res.status(201).json(contributors);
  });
});

router.post("/homepage/generatePaper", (req, res, next) => {
  console.log(req.body);
  Courses.find({
    subId: req.body.subID
  })
  .then((course)=>{
    Model.find({
      _id:req.body.modelID
    })
    .then((model)=>{
      console.log(course);
      console.log(model);
    })
  })

});

router.post("/homepage/addmodel", checkAuth, (req, res, next) => {
  console.log("hit");

  const model = new Models({
    numberOfQuestions: req.body.numberOfQuestions,
    questionModelList: req.body.questionModelList,
    totalMarks: req.body.totalMarks
  });
  model.save((err, doc) => {
    if (err) {
      res.status(404).json({ message: "Not Saved" });
    } else if (doc) {
      res.status(201).json({ message: "Saved" });
    }
  });
});

router.post("/homepage/addcourses", checkAuth, (req, res, next) => {
  var courses = new Courses({
    // subName: req.body.subName,
    subId: req.body.subId,
    sem: req.body.sem,
    dept: req.body.dept,
    marksType: req.body.marksType.split(","),
    numberOfModules: req.body.numberOfModules,
    moduleDetails: req.body.moduleDetails
  });
  console.log(courses);
  courses.save((err, doc) => {
    if (!err) {
      res.send(doc);
    } else {
      console.log(
        "Error in Courses Save :" + JSON.stringify(err, undefined, 2)
      );
    }
  });
});

router.get("/homepage/getModels", (req, res)=> {
  Models.find()
  .then((data) => {
    res.status(200).json(data);
  })
})

router.get('/homepage/getSubjectData', (req, res) => {
  const subId = req.query.subid;
  Courses.findOne({subId})
  .then((data) => {
    res.status(200).json(data);
  })
});

module.exports = router;
