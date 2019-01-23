const express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

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


module.exports = router;
