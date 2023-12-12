const dotenv = require("dotenv").config();

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let users = [];

function userchecker(username) {
  for (let user of users) {
    if (user.username === username) {
      return true;
    }
  }
  return false;
}

function getuser(username) {
  for (let user of users) {
    if (user.username === username) {
      return user;
    }
  }
  return null;
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
  body("username").trim().escape(),
  body("password").escape(),
  async (req, res) => {
    if (userchecker(req.body.username)) {
      let user = getuser(req.body.username);
      bcrypt.compare(req.body.password, user.password, (err, Matches) => {
        if (err) {
          res.status(500).send("Error hashing password");
          return;
        }
        if (Matches) {
          const jwtPayload = {
            id: user._id,
            username: user.username,
          };
          jwt.sign(
            jwtPayload,
            process.env.SECRET,
            {
              expiresIn: 120,
            },
            (err, token) => {
              res.json({ success: true, token });
            }
          );
        }
      });
    } else {
      return res.status(403).json({ message: "Login faile :(" });
    }
  }
);

module.exports = router;
