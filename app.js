const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const expressValidator = require('express-validator');

const { mongoose } = require('./db.js');
var admin = require('./controllers/adminController.js');


var app = express();
var contributorsController = require('./controllers/contributorsController.js');
var validatorsController = require('./controllers/validatorsController.js');
var coursesController = require('./controllers/coursesController.js');

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(expressValidator());
app.use(bodyParser.json());


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});


app.listen(3000, () => console.log('Server started at port : 3000'));



app.use('/validators', validatorsController);
app.use('/courses', coursesController);
app.use('/contributors', contributorsController);
app.use('/admin',admin);






