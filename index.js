const express = require('express');
const routes = require("./routes");
const path = require("path");
const bodyParser = require("body-parser");

//helpers
const helpers = require('./helpers');

// creating the connection to the database
const db = require('./config/db');

// importing data models
require('./models/Projects');
require('./models/Tasks');

// synchronizing with database
db.sync()
    .then(() => console.log("Connected to the server succesfully!"))
    .catch(error => console.log(error));

const app = express();

// configuring Template Engine
app.set("view engine", 'pug')
app.set("views", path.join(__dirname, "views"))

// set static files folder
app.use(express.static('public'));

// passing vardump to application
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    next();    
});

// understanding middleware
app.use((req, res, next) => {
    const date = new Date();
    res.locals.year = date.getFullYear();
    next();
});


// configuring body-parser
app.use(bodyParser.urlencoded({extended: true}));


// router
app.use("/", routes());




app.listen(3000);