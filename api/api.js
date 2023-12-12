const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
let users = [];

function userchecker(username, users) {
  // Iterate over the array of user objects
  for (let user of users) {
    // Check if the username matches the 'username' property of the current object
    if (user.username === username) {
      return true; // Return true if the username is found
    }
  }
  return false; // Return false if the username is not found
}

router.post("/user/register", async (req, res) => {
  const username = req.body.username;

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      if (err) throw err;

      if (!userchecker(username)) {
        let user = JSON.parse({
          id: users.length,
          username: username,
          password: hash,
        });

        users.push(user);
        res.send(user);
      } else {
        res.status(400).message("username check failed");
      }
    });
  });
});
