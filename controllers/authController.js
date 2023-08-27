const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
  // we should hash password before User.create()
  if (req.body.username && req.body.password) {
    let plainTextPassword = req.body.password;
    bcrypt.hash(plainTextPassword, 10, async (err, hashedPassword) => {
      if (err) {
        return res.status(500).send("Error hashing the password.");
      }
      req.body.password = hashedPassword;
      let newUser = await User.create(req.body);

      res.redirect("/login"); // Redirecting to login page after signup
    });
  } else {
    res.status(400).send("Missing username or password.");
  }
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", async (req, res) => {
  console.log(req.body);

  let userToLogin = await User.findOne({ username: req.body.username });

  if (userToLogin) {
    bcrypt.compare(req.body.password, userToLogin.password, (err, result) => {
      if (result) {
        req.session.userId = userToLogin._id;
        req.session.name = userToLogin.name;

        res.redirect("/profile");
      } else {
        res.send("Incorrect Passord");
      }
    });
  }
});

router.get("/profile", async (req, res) => {
  // Assuming the user must be authenticated to view the profile
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  try {
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.redirect("/login");
    }

    res.render("auth/profile", { user }); // Assuming you have a view named profile.ejs (or another template engine) inside the 'auth' folder
  } catch (error) {
    console.error("Error fetching user for profile:", error);
    res.status(500).send("Server Error");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
