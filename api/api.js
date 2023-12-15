const dotenv = require("dotenv").config();

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
express().use(passport.session());
let users = [];
let todos = [];

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

router.post("/user/register", checkNotAuthenticated, async (req, res) => {
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
    failureRedirect: "/api/login-fail",
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

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.sendStatus(401);
}

router.get("/secret", checkAuthenticated, (req, res) => {
  res.sendStatus(200);
});

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  return next();
}

router.post("/todos", checkAuthenticated, (req, res, next) => {
  const newTodo = req.body.todo;
  const userId = req.user.id;
  let userTodo = todos.find((todo) => todo.id === userId);

  if (!userTodo) {
    userTodo = { id: userId, todos: [] };
    todos.push(userTodo);
  }

  userTodo.todos.push(newTodo || "");
  res.json(userTodo);
});

router.get("/todos/list", (req, res) => {
  res.json(todos);
});

module.exports = router;
