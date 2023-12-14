const dotenv = require("dotenv").config();

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
express().use(passport.session());
let users = [];

function userchecker(username) {
  for (let user of users) {
    if (user.username === username) {
      return true;
    }
  }
  return false;
}
const initializePassport = require("../passport-config");
initializePassport(passport, getuser, getUserById);

function getuser(username) {
  return users.find((user) => user.username === username);
}

function getUserById(id) {
  return users.find((user) => user.id === id);
}

router.post("/user/register", async (req, res) => {
  const username = req.body.username;

  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      res.status(500).send("Error generating salt");
      return;
    }
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      if (err) {
        res.status(500).send("Error hashing password");
        return;
      }

      if (!userchecker(username)) {
        const user = {
          id: users.length + 1,
          username: username,
          password: hash,
        };

        users.push(user);
        console.log(user);
        res.send(user);
      } else {
        res.status(400).send("Username already exists");
      }
    });
  });
});

router.get("/user/list", (req, res) => {
  res.json(users);
});

router.post(
  "/user/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    //
    //successRedirect: "/",
    failureRedirect: "/login-fail",
  }),
  (req, res) => {
    // Successful authentication
    res.sendStatus(200);
  }
);

router.get("/login-fail", (req, res) => {
  res.sendStatus(401);
});

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  return next();
}

module.exports = router;
