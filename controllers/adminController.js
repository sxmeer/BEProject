const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generator = require("generate-password");
const nodemailer = require("nodemailer");
const Admin = require("../models/admin");
const Departments = require("../models/departments");
const Subjects = require("../models/subjects");
const Status = require('../models/status');
var Validators = require("../models/validators");
var Contributors = require("../models/contributors");
var Courses = require("../models/courses");
var Models = require("../models/models");
var checkAuth = require("./middleware/admin-check-auth");
var Model = require("../models/models");
var QuestionSet = require("../models/questions");

var pdfMakePrinter = require("pdfmake/src/printer");
var fs = require("fs");

const stringSimilarity = require("string-similarity");

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
        name: fetchedUser.name,
        expiresIn: 3600
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Auth failed"
      });
    });
});

router.get("/insert", (req, res) => {
  QuestionSet.updateMany(
    {},
    { $set: { checked: 0, asked: 0, isValid: 0 } }
  ).then(docs => {
    res.send(docs);
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
                <h3>Hello ${validator.name},</h3>
                <h3>Congratulations!, you have been appointed as validator for subject ${subName} - ${deptName}.</h3>
                <h3>You can login to qpg.com using the credentials given below.</h3>
                <br><br>
                <h4 style="color: red">User ID: <span style="color: purple">${
                  validator.id
                }</span></h4>
                <br>
                <h4 style="color: red">Password: <span style="color: purple">${genPass}</span></h4>
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
                Departments.find({ deptID: contributor.department }).then(
                  data => {
                    const deptName = data[0].name;
                    Subjects.find({ subID: contributor.subjectsAssigned }).then(
                      subData => {
                        const subName = subData[0].name;
                        const html = `
                      <h1 style="color: blue; text-align: center;">Question Paper Generator</h1>
                      <br><br>
                      <h3>Hello ${contributor.name},</h3>
                      <h3>Congratulations!, you have been appointed as contributor for subject ${subName} - ${deptName}.</h3>
                      <h3>You can login to qpg.com using the credentials given below.</h3>
                      <br><br>
                      <h4 style="color: red">User ID: <span style="color: purple">${
                        contributor.id
                      }</span></h4>
                      <br>
                      <h4 style="color: red">Password: <span style="color: purple">${genPass}</span></h4>
                      <br>`;
                        const mailOptions = {
                          from: "wtlminiproject84@gmail.com",
                          to: contributor.email,
                          subject: "QPG: Contributor Login Credentials",
                          html: html
                        };
                        transporter.sendMail(mailOptions, function(
                          error,
                          info
                        ) {
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
                  }
                );
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
  console.log("hit")
  Courses.find({
    subId: req.body.subID
  }).then(course => {
    Model.find({
      _id: req.body.modelID
    }).then(model => {
      var Course = course[0];
      var ModelOfPaper = model[0];
      var QuestionId = new Array(50).fill(-4);
      var Question = new Array(50).fill(-4);
      var Question_temp = new Array(50).fill(-4);
      var StatusOfQue = new Array(50).fill(-4);
      var UnitNo = new Array(50).fill(-4);
      var Unit = new Array(50).fill(-4);
      var StatusOfUnit = new Array(50).fill(-4);

      var Difficulty_level_no = new Array(50).fill(-4);
      var Difficulty_level = new Array(50).fill(-4);
      var StatusOfDiff = new Array(50).fill(-4);

      var Cognitive_level_no = new Array(50).fill(-4);
      var Cognitive_level = new Array(50).fill(-4);
      var StatusOfCog = new Array(50).fill(-4);

      var subQuestion = new Array(50).fill(-4);
      var subSubQuestion = new Array(50).fill(-4);

      for (let iter = 0; iter < ModelOfPaper.questionModelList.length; iter++) {
        QuestionId[iter] = ModelOfPaper.questionModelList[iter].questionNumber;
        Question[iter] = ModelOfPaper.questionModelList[iter].marks;
        Question_temp[iter] = ModelOfPaper.questionModelList[iter].marks;
        StatusOfQue[iter] = 1;
        UnitNo[iter] = 0;
        Difficulty_level_no[iter] = 0;
        Cognitive_level_no[iter] = 0;
        subSubQuestion[iter]=1;
        subQuestion[iter]="A";
      }
      for (let iter = 0; iter < Course.numberOfModules; iter++) {
        Unit[iter] = req.body.unitwiseDistribution[iter];
        if (Unit[iter] == 0) {
          StatusOfUnit[iter] = -1;
        } else {
          StatusOfUnit[iter] = 1;
        }
      }
      for (let iter = 0; iter < req.body.difficulty.length; iter++) {
        Difficulty_level[iter] = req.body.difficulty[iter];
        if (Difficulty_level[iter] == 0) {
          StatusOfDiff[iter] = -1;
        } else {
          StatusOfDiff[iter] = 1;
        }
        Cognitive_level[iter] = req.body.cognitive[iter];
        if (Cognitive_level[iter] == 0) {
          StatusOfCog[iter] = -1;
        } else {
          StatusOfCog[iter] = 1;
        }
      }

      for (let iter = 1; QuestionId[iter] != -4; iter++) {
        if (QuestionId[iter] == QuestionId[iter - 1]) {
          subQuestion[iter] = String.fromCharCode(subQuestion[iter - 1].charCodeAt(0) + 1);
        } else {
          subQuestion[iter] = "A";
        }
      }
      //functions

      checkCondition = function(array) {
        for (let i = 0; array[i] != -4; i++) {
          if (array[i] == 1) return false;
        }
        return true;
      };

      maxim = function(array, status) {
        let LocQq = -1;
        let maxi = -99;
        for (let i = 0; array[i] != -4; i++) {
          if (status[i] == -1) {
            continue;
          }
          if (array[i] > maxi) {
            maxi = array[i];
            LocQq = i;
          }
        }
        return LocQq;
      };
      maxUnit = function(array, status, questionMax) {
        let LocUu = -1,
          i;
        let diff = -1000;
        for (let i = 0; array[i] != -4; i++) {
          if (status[i] == -1) {
            continue;
          }
          if (questionMax - array[i] > 0) continue;
          if (questionMax - array[i] > diff) {
            diff = questionMax - array[i];
            LocUu = i;
          }
        }
        if (LocUu == -1) {
          LocUu = maxim(array, status);
        }
        return LocUu;
      };
      shiftArray = function(array, pos) {
        let i,
          count = 0;
        for (let i = 0; array[i] != -4; i++) count++;
        for (let i = count; i > pos; i--) {
          array[i] = array[i - 1];
        }
      };
      // step1
      for (let i = 0; Question[i] != -4; i++) {
        if (StatusOfQue[i] == -1) continue;
        for (let j = 0; Unit[j] != -4; j++) {
          if (StatusOfUnit[j] == -1) continue;
          if (Question[i] == Unit[j]) {
            Question[i] = 0;
            Unit[j] = 0;

            UnitNo[i] = j + 1;

            StatusOfQue[i] = -1;
            StatusOfUnit[j] = -1;
            break; //added
          }
        }
      }

      //step 2
      for (let i = 0; Question[i] != -4; i++) {
        let flag = false; //added
        if (StatusOfQue[i] == -1) continue;
        for (let j = i + 1; Question[j] != -4; j++) {
          if (StatusOfQue[j] == -1) continue;
          for (let k = 0; Unit[k] != -4; k++) {
            if (StatusOfUnit[k] == -1) continue;
            if (Question[i] + Question[j] == Unit[k]) {
              StatusOfQue[i] = -1;
              StatusOfQue[j] = -1;
              StatusOfUnit[k] = -1;

              Question[i] = 0;
              Question[j] = 0;
              Unit[k] = 0;

              UnitNo[i] = k + 1;
              UnitNo[j] = k + 1;
              flag = true; //added
              break; //added
            }
          }
          if (flag) {
            //added
            break; //added
          } //added
        }
      }

      //step 3

      while (!checkCondition(StatusOfQue)) {
        let LocQ = maxim(Question, StatusOfQue);
        let LocU = maxUnit(Unit, StatusOfUnit, Question[LocQ]);
        if (Question[LocQ] == Unit[LocU]) {
          Unit[LocU] = 0;
          Question[LocQ] = 0;
          UnitNo[LocQ] = LocU + 1;
          StatusOfQue[LocQ] = -1;
          StatusOfUnit[LocU] = -1;
        } else if (Unit[LocU] > Question[LocQ]) {
          Unit[LocU] = Unit[LocU] - Question[LocQ];
          Question[LocQ] = 0;
          UnitNo[LocQ] = LocU + 1;
          StatusOfQue[LocQ] = -1;
        } else if (Unit[LocU] < Question[LocQ]) {
          let part1 = Unit[LocU];
          let part2 = Question[LocQ] - part1;

          shiftArray(Question, LocQ);
          shiftArray(Question_temp, LocQ);
          shiftArray(QuestionId, LocQ);
          shiftArray(StatusOfQue, LocQ);
          shiftArray(UnitNo, LocQ);
          Question[LocQ] = part1;
          Question[LocQ + 1] = part2;
          Question_temp[LocQ] = part1;
          Question_temp[LocQ + 1] = part2;
          QuestionId[LocQ + 1] = QuestionId[LocQ]; //added
          StatusOfQue[LocQ + 1] = StatusOfQue[LocQ]; //added

          shiftArray(subQuestion, LocQ);

          Unit[LocU] = 0;
          Question[LocQ] = 0;
          UnitNo[LocQ] = LocU + 1;
          StatusOfQue[LocQ] = -1;
          StatusOfUnit[LocU] = -1;
        }
      }
      template_array = [];
      for (let i = 0; QuestionId[i] != -4; i++) {
        template_array.push({
          question: QuestionId[i],
          marks: Question_temp[i],
          unit: UnitNo[i],
          cog: Cognitive_level_no[i],
          diff: Difficulty_level_no[i]
        });
      }
      console.log(template_array);
      console.log("end");
      //************************************* */

      //For Difficulty
      //status of question and question array updation
      // System.out.println("for difficulty");
      for (let i = 0; Question_temp[i] != -4; i++) {
        Question[i] = Question_temp[i];
        StatusOfQue[i] = 1;
      }
      //step 1
      for (let i = 0; Question[i] != -4; i++) {
        if (StatusOfQue[i] == -1) continue;
        for (let j = 0; Difficulty_level[j] != -4; j++) {
          if (StatusOfDiff[j] == -1) continue;
          if (Question[i] == Difficulty_level[j]) {
            Question[i] = 0;
            Difficulty_level[j] = 0;

            Difficulty_level_no[i] = j + 1;

            StatusOfQue[i] = -1;
            StatusOfDiff[j] = -1;
            break; //added
          }
        }
      }

      //end of step 1

      //step two

      for (let i = 0; Question[i] != -4; i++) {
        let flag = false; //added
        if (StatusOfQue[i] == -1) continue;
        for (let j = i + 1; Question[j] != -4; j++) {
          if (StatusOfQue[j] == -1) continue;
          for (let k = 0; Difficulty_level[k] != -4; k++) {
            if (StatusOfDiff[k] == -1) continue;
            if (Question[i] + Question[j] == Difficulty_level[k]) {
              StatusOfQue[i] = -1;
              StatusOfQue[j] = -1;
              StatusOfDiff[k] = -1;

              Question[i] = 0;
              Question[j] = 0;
              Difficulty_level[k] = 0;

              Difficulty_level_no[i] = k + 1;
              Difficulty_level_no[j] = k + 1;
              flag = true; //added
              break; //added
            }
          }
          if (flag) {
            //added
            break; //added
          } //added
        }
      }

      //step 3
      while (!checkCondition(StatusOfQue)) {
        let LocQ = maxim(Question, StatusOfQue);
        let LocU = maxUnit(Difficulty_level, StatusOfDiff, Question[LocQ]);
        if (Question[LocQ] == Difficulty_level[LocU]) {
          Difficulty_level[LocU] = 0;
          Question[LocQ] = 0;
          Difficulty_level_no[LocQ] = LocU + 1;
          StatusOfQue[LocQ] = -1;
          StatusOfDiff[LocU] = -1;
        } else if (Difficulty_level[LocU] > Question[LocQ]) {
          Difficulty_level[LocU] = Difficulty_level[LocU] - Question[LocQ];
          Question[LocQ] = 0;
          Difficulty_level_no[LocQ] = LocU + 1;
          StatusOfQue[LocQ] = -1;
        } else if (Difficulty_level[LocU] < Question[LocQ]) {
          let part1 = Difficulty_level[LocU];
          let part2 = Question[LocQ] - part1;

          shiftArray(Question, LocQ);
          shiftArray(Question_temp, LocQ);
          shiftArray(QuestionId, LocQ);
          shiftArray(StatusOfQue, LocQ);
          shiftArray(UnitNo, LocQ);
          shiftArray(Difficulty_level_no, LocQ);

          Question[LocQ] = part1;
          Question[LocQ + 1] = part2;
          Question_temp[LocQ] = part1;
          Question_temp[LocQ + 1] = part2;
          QuestionId[LocQ + 1] = QuestionId[LocQ]; //added
          StatusOfQue[LocQ + 1] = StatusOfQue[LocQ]; //added

          shiftArray(subQuestion, LocQ);

          Difficulty_level[LocU] = 0;
          Question[LocQ] = 0;
          Difficulty_level_no[LocQ] = LocU + 1;
          StatusOfQue[LocQ] = -1;
          StatusOfDiff[LocU] = -1;
        }
      }
      template_array = [];
      for (let i = 0; QuestionId[i] != -4; i++) {
        template_array.push({
          question: QuestionId[i],
          marks: Question_temp[i],
          unit: UnitNo[i],
          cog: Cognitive_level_no[i],
          diff: Difficulty_level_no[i]
        });
      }
      console.log("Step 1");
      console.log(template_array);

      //For Cognitive
      //status of question and question array updation
      for (let i = 0; Question_temp[i] != -4; i++) {
        Question[i] = Question_temp[i];
        StatusOfQue[i] = 1;
      }
      //step 1
      for (let i = 0; Question[i] != -4; i++) {
        if (StatusOfQue[i] == -1) continue;
        for (let j = 0; Cognitive_level[j] != -4; j++) {
          if (StatusOfCog[j] == -1) continue;
          if (Question[i] == Cognitive_level[j]) {
            Question[i] = 0;
            Cognitive_level[j] = 0;

            Cognitive_level_no[i] = j + 1;

            StatusOfQue[i] = -1;
            StatusOfCog[j] = -1;
            break; //added
          }
        }
      }

      //end of step 1

      //step two

      for (let i = 0; Question[i] != -4; i++) {
        let flag = false; //added
        if (StatusOfQue[i] == -1) continue;
        for (let j = i + 1; Question[j] != -4; j++) {
          if (StatusOfQue[j] == -1) continue;
          for (let k = 0; Cognitive_level[k] != -4; k++) {
            if (StatusOfCog[k] == -1) continue;
            if (Question[i] + Question[j] == Cognitive_level[k]) {
              StatusOfQue[i] = -1;
              StatusOfQue[j] = -1;
              StatusOfCog[k] = -1;

              Question[i] = 0;
              Question[j] = 0;
              Cognitive_level[k] = 0;

              Cognitive_level_no[i] = k + 1;
              Cognitive_level_no[j] = k + 1;
              flag = true; //added
              break; //added
            }
          }
          if (flag) {
            //added
            break; //added
          } //added
        }
      }

      //step 3
      while (!checkCondition(StatusOfQue)) {
        let LocQ = maxim(Question, StatusOfQue);
        let LocU = maxUnit(Cognitive_level, StatusOfCog, Question[LocQ]);
        if (Question[LocQ] == Cognitive_level[LocU]) {
          Cognitive_level[LocU] = 0;
          Question[LocQ] = 0;
          Cognitive_level_no[LocQ] = LocU + 1;
          StatusOfQue[LocQ] = -1;
          StatusOfCog[LocU] = -1;
        } else if (Cognitive_level[LocU] > Question[LocQ]) {
          Cognitive_level[LocU] = Cognitive_level[LocU] - Question[LocQ];
          Question[LocQ] = 0;
          Cognitive_level_no[LocQ] = LocU + 1;
          StatusOfQue[LocQ] = -1;
        } else if (Cognitive_level[LocU] < Question[LocQ]) {
          let part1 = Cognitive_level[LocU];
          let part2 = Question[LocQ] - part1;

          shiftArray(Question, LocQ);
          shiftArray(Question_temp, LocQ);
          shiftArray(QuestionId, LocQ);
          shiftArray(StatusOfQue, LocQ);
          shiftArray(UnitNo, LocQ);
          shiftArray(Difficulty_level_no, LocQ);
          shiftArray(Cognitive_level_no, LocQ);

          Question[LocQ] = part1;
          Question[LocQ + 1] = part2;
          Question_temp[LocQ] = part1;
          Question_temp[LocQ + 1] = part2;
          QuestionId[LocQ + 1] = QuestionId[LocQ]; //added
          StatusOfQue[LocQ + 1] = StatusOfQue[LocQ]; //added

          shiftArray(subQuestion, LocQ);

          Cognitive_level[LocU] = 0;
          Question[LocQ] = 0;
          Cognitive_level_no[LocQ] = LocU + 1;
          StatusOfQue[LocQ] = -1;
          StatusOfCog[LocU] = -1;
        }
      }
      let counter = 1;
      for (let i = 1; QuestionId[i] != -4; i++) {
        if (
          subQuestion[i] === subQuestion[i - 1] &&
          QuestionId[i] === QuestionId[i - 1]
        ) {
          subSubQuestion[i] = ++counter;
        } else {
          counter = 1;
          subSubQuestion[i] = counter;
        }
      }
      template_array = [];
      for (let i = 0; QuestionId[i] != -4; i++) {
        template_array.push({
          question: QuestionId[i],
          subQuestion: subQuestion[i],
          subSubQuestion: subSubQuestion[i],
          marks: Question_temp[i],
          unit: UnitNo[i],
          cog: Cognitive_level_no[i],
          diff: Difficulty_level_no[i]
        });
      }
      console.log(template_array);
      var QuestionList = new Array(template_array.length);

      function check(query, k, msg, callbackReturns) {
        QuestionSet.countDocuments(query).then(count => {
          if (count == 0) {
            callbackReturns();
          } else {
            var r = Math.floor(Math.random() * count);
            QuestionSet.find(query)
              .limit(1)
              .skip(r)
              .then(questions => {
                var ind;
                for (ind = 0; ind < QuestionList.length; ind++) {
                  if (k === ind) {
                    continue;
                  }
                  if (
                    QuestionList[ind] != null &&
                    template_array[ind].unit === template_array[k].unit
                  ) {

                    let stringSimilarityResult = stringSimilarity.compareTwoStrings(
                      QuestionList[ind].question,
                      questions[0].question
                    );
                    console.log("check"+stringSimilarityResult);
                    if (stringSimilarityResult >= 0.6) {
                      QuestionSet.findOneAndUpdate(
                        { _id: questions[0].toObject()._id },
                        { $set: { checked: 1 } },
                        (err, doc) => {
                          console.log("checked" + doc);
                          check(query, k, msg, callbackReturns);
                        }
                      );
                    }
                  }
                }
                if (ind == QuestionList.length) {
                  QuestionList[k] = questions[0];
                  if (QuestionList[k] != null) {
                    console.log("asyncLoop " + msg + " " + k);
                    QuestionSet.findOneAndUpdate(
                      { _id: questions[0].toObject()._id },
                      { $set: { checked: 1 } },
                      (err, doc) => {
                        console.log(doc);
                      }
                    );
                  }
                }
                callbackReturns();
              })
              .catch(err => {});
          }
        });
      }

      function asyncLoop(k, callback) {
        if (k < template_array.length) {
          var query = {
            subjectID: req.body.subID,
            asked: 0,
            module: template_array[k].unit,
            cognitive: template_array[k].cog,
            difficulty: template_array[k].diff,
            marks: {
              $gte: template_array[k].marks - 2,
              $lte: template_array[k].marks + 2
            },
            asked: 0,
            checked: 0
          };
          check(query, k, "one", () => {
            asyncLoop(k + 1, callback);
          });
        } else {
          callback();
        }
      }

      function asyncLoopTwo(k, callback) {
        if (k < template_array.length && QuestionList[k] == null) {
          var lt, gt;
          if (template_array[k].marks <= 5) {
            lt = 5;
            gt = 0;
          } else {
            lt = 20;
            gt = 6;
          }
          var query = {
            subjectID: req.body.subID,
            asked: 0,
            module: template_array[k].unit,
            cognitive: template_array[k].cog,
            difficulty: template_array[k].diff,
            marks: { $gte: gt, $lte: lt },
            asked: 0,
            checked: 0
          };
          check(query, k, "two", () => {
            asyncLoopTwo(k + 1, callback);
          });
        } else if (k < template_array.length && QuestionList[k] != null) {
          asyncLoopTwo(k + 1, callback);
        } else {
          callback();
        }
      }

      function asyncLoopThird(k, callback) {
        if (k < template_array.length && QuestionList[k] == null) {
          var lt, gt;
          if (template_array[k].marks <= 5) {
            lt = 5;
            gt = 0;
          } else {
            lt = 20;
            gt = 6;
          }
          var query = {
            subjectID: req.body.subID,
            asked: 0,
            module: template_array[k].unit,
            $or: [
              { cognitive: template_array[k].cog },
              { difficulty: template_array[k].diff }
            ],
            marks: { $gte: gt, $lte: lt },
            asked: 0,
            checked: 0
          };
          check(query, k, "three", () => {
            asyncLoopThird(k + 1, callback);
          });
        } else if (k < template_array.length && QuestionList[k] != null) {
          asyncLoopThird(k + 1, callback);
        } else {
          callback();
        }
      }
      function generatePDF(res) {
        var documentDefinition = {
          content: ["Question Paper"]
        };
        for (let index = 0; index < template_array.length; index++) {
          var str = `Q${template_array[index].question})${template_array[index].subQuestion})${template_array[index].subSubQuestion})\t${QuestionList[index].question} ${template_array[index].marks} marks\n`;
          console.log(str);
          documentDefinition.content.push(str);
        }
        console.log("hello");
        var fontDescriptors = {
          Roboto: {
            normal:
              "node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf",
            bold:
              "node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf",
            italics:
              "node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf",
            bolditalics:
              "node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf"
          }
        };
        var printer = new pdfMakePrinter(fontDescriptors);
        var doc = printer.createPdfKitDocument(documentDefinition);
        var link = `D:/Projects/BEProject/Media/QuestionPaper-${new Date().getTime()}.pdf`;
        doc.pipe(
          fs.createWriteStream(link).on("error", err => {
            console.log(err.message);
            // errorCallback(err.message);
          })
        );
        doc.on("end", () => {
          console.log("PDF successfully created and stored");
          const mailOptions = {
            from: "wtlminiproject84@gmail.com",
            to: "sanjeev1996s@gmail.com",
            subject: "Generated Paper",
            text: "Checkout the attached Question Paper",
            attachments: [
              {
                filename: "paper.pdf",
                path: link,
                contentType: "application/pdf"
              }
            ]
          };
          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              console.log(error);
              res.status(404).json({ msg: "Failed to send mail" });
            } else {
              console.log("Email sent: " + info.response);
              res.status(200).json({ msg: "E-mail sent to admin" });
            }
          });
        });
        doc.end();
      }
      function unsuccessfullUpdate(k, callbackReturnsThree) {
        if (k < QuestionList.length && QuestionList[k] == null) {
          unsuccessfullUpdate(k + 1, callbackReturnsThree);
        } else if (k < QuestionList.length) {
          QuestionSet.findOneAndUpdate(
            {
              _id: QuestionList[k]._id
            },
            {
              $set: {
                checked: 0
              }
            }
          ).then(doc => {
            unsuccessfullUpdate(k + 1, callbackReturnsThree);
          });
        } else {
          callbackReturnsThree();
        }
      }

      function updatePreviouslyAskedQuestions(ch, callbackReturnsFour) {
        QuestionSet.updateMany(
          {
            subjectID: req.body.subID,
            asked: { $gt: 0 }
          },
          {
            $inc: { asked: -1 }
          }
        ).then(docs => {
          callbackReturnsFour();
        });
      }

      function updateQuestionAsked(k, callbackReturnsTwo) {
        if (k < QuestionList.length) {
          QuestionSet.findOneAndUpdate(
            {
              _id: QuestionList[k]._id
            },
            {
              $set: {
                checked: 0
              },
              $inc: {
                asked: 2
              }
            }
          ).then(doc => {
            updateQuestionAsked(k + 1, callbackReturnsTwo);
          });
        } else {
          callbackReturnsTwo();
        }
      }

      asyncLoop(0, () => {
        asyncLoopTwo(0, () => {
          asyncLoopThird(0, () => {
            let flag = false;
            for (let iterator = 0; iterator < QuestionList.length; iterator++) {
              if (QuestionList[iterator] == null) {
                flag = true;
              }
            }
            if (flag) {
              unsuccessfullUpdate(0, () => {
                console.log("not enough questions");
                res.status(200).json({
                  msg: "not enough questions"
                });
              });
            } else {
              updatePreviouslyAskedQuestions(0, () => {
                updateQuestionAsked(0, () => {
                  generatePDF(res);
                });
              });
            }
          });
        });
      });
    });
  });
});

router.post("/homepage/addmodel", (req, res, next) => {
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

router.get("/homepage/getModels", (req, res) => {
  Models.find().then(data => {
    res.status(200).json(data);
  });
});

router.get("/homepage/getSubjectData", (req, res) => {
  const subId = req.query.subid;
  Courses.findOne({ subId }).then(data => {
    res.status(200).json(data);
  });
});

router.get('/homepage/getSubjectStatus', (req, res) => {
  const subjectID = req.query.subjectID;
  Status.findOne({ subjectID })
    .then(data => {
      res.status(200).json(data);
  });
});

router.post('/homepage/createStatus', (req,res) => {
  subjectID = req.body.subjectID;
  user = req.body.user;
  console.log('req: '+JSON.stringify(req.body, undefined, 2));
  let newStatus = new Status({
    subjectID: subjectID,
    contributor: 0,
    validator: 0
  });
  if (user === 'contributor') {
    newStatus.contributor = 1;
  } else if (user === 'validator') {
    newStatus.validator = 1;
  }
  console.log(JSON.stringify(newStatus, undefined, 2));
  newStatus.save()
  .then((doc, err) => {
    if(err) {
      console.log("Error : "+err);
      res.json({error: 'Error saving document'});
    } else {
      res.json({result: 'Status Changed'});
    }
  })
});

router.post('/homepage/updateStatus', (req,res) => {
  subjectID = req.body.subjectID;
  user = req.body.user;
  newValue = req.body.newValue;
  // console.log(JSON.stringify(newStatus, undefined, 2));
  if(user === 'contributor') {
    Status.findOneAndUpdate({subjectID}, {$set : {contributor : newValue}}, (err, doc) => {
      if (err) {
        console.log("Something wrong when updating data!");
        res.status(200).json({err: 'Error updating document'});
      } else {
        console.log(doc)
        res.status(200).json({success: 'Status updated'});
      }
    })
  } else if (user === 'validator') {
    Status.findOneAndUpdate({subjectID}, {$set : {validator : newValue}}, (err, doc) => {
      if (err) {
        console.log("Something wrong when updating data!");
        res.status(200).json({err: 'Error updating document'});
      } else {
        console.log(doc)
        res.status(200).json({success: 'Status updated'});
      }
    })
  }
});

module.exports = router;
