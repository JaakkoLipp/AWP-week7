var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const dotenv = require("dotenv").config();

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./api/api");

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", authRouter);

module.exports = app;
