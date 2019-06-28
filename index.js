const express = require('express');
const routes = require("./routes");
const path = require("path");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require('./config/passport');
//helpers
const helpers = require('./helpers');

// creating the connection to the database
const db = require('./config/db');

// importing data models
require('./models/Projects');
require('./models/Tasks');
require('./models/Users');

// synchronizing with database
db.sync()
.then(() => console.log("Connected to the server succesfully!"))
.catch(error => console.log(error));

const app = express();

// set static files folder
app.use(express.static('public'));

// configuring Template Engine
app.set("view engine", 'pug')
app.set("views", path.join(__dirname, "views"))

// configuring body-parser
app.use(bodyParser.urlencoded({extended: true}));

// express-validator
app.use(expressValidator());

// add flash messages
app.use(flash());

// sesiones nos permiten navegar entre distintas paginas sin volver a autenticar
app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());

// passing vardump to application
app.use((req, res, next) => {
    res.locals.year = new Date().getFullYear();
    res.locals.vardump = helpers.vardump;
    res.locals.messages = req.flash();
    res.locals.user = {...req.user} || null;
    next();    
});

// router
app.use("/", routes());

app.listen(3000);