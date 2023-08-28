const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
  if (req.body.username && req.body.password) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        return res.status(400).send("Username already exists.");
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;
      await User.create(req.body);
      res.redirect("/login"); // Redirecting to login page after signup
    } catch (error) {
      console.error("Error during signup:", error);
      res.status(500).send("Server Error");
    }
  } else {
    res.status(400).send("Missing username or password.");
  }
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", async (req, res) => {
  try {
    let userToLogin = await User.findOne({ username: req.body.username });

    if (userToLogin) {
      const isMatch = await bcrypt.compare(
        req.body.password,
        userToLogin.password
      );
      if (isMatch) {
        req.session.userId = userToLogin._id;
        req.session.name = userToLogin.name;
        res.redirect("/profile");
      } else {
        res.send("Incorrect Password");
      }
    } else {
      res.send("User not found");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Server Error");
  }
});

router.get("/profile", async (req, res) => {
  let schools = [
    {
      name: "Arrowhead Elementary School",
      Address: "19100 E Bates Ave, Aurora, CO 80013",
      Hours: "Closed-Opens 7:45 AM Thu",
      Phone: "(720) 886-2800",
      District: "Cherry Creek School District 5",
      Lowest_grade: "Pre-kindergarten",
      Highest_grade: "Fifth Grade",
    },
    {
      name: "Side Creek Elementary School",
      Address: "19191 E Iliff Ave, Aurora, CO 80013",
      Hours: "Closed-Opens 7:45 AM Thu",
      Phone: "(303) 755-1785",
      District: "Adams-Arapahoe School District 28J",
      Lowest_grade: "Pre-kindergarten",
      Highest_grade: "Fifth Grade",
    },
    {
      name: "Dalton Elementary School",
      Address: "17401 E Darhmouth Ave, Aurora, CO 80013",
      Hours: "Closed-Opens 7:45 AM Thu",
      Phone: "(303) 693-7561",
      District: "Adams-Arapahoe School District 28J",
      Lowest_grade: "Pre-kindergarten",
      Highest_grade: "Fifth Grade",
    },
    {
      name: "Dartmouth Elementary School",
      Address: "3050 S Laredo St, Aurora, CO 80013",
      Hours: "Closed-Opens 7:45 AM Thu",
      Phone: "(303) 690-1155",
      District: "Cherry Creek School District 5",
      Lowest_grade: "Pre-kindergarten",
      Highest_grade: "Fifth Grade",
    },
    {
      name: "Vassar",
      Address: "18101 E Vassar Pl, Aurora, CO 80013",
      Hours: "Closed-Opens 7:45 AM Thu",
      Phone: "(303) 752-3772",
      District: "Adams-Araphoe School District 28J",
      Lowest_grade: "Pre-kindergarten",
      Highest_grade: "Fifth Grade",
    },
  ];
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.redirect("/login");
    }

    res.render("auth/profile", { user, schools });
  } catch (error) {
    console.error("Error fetching user for profile:", error);
    res.status(500).send("Server Error");
  }
});

router.post("/profile/delete-item", async (req, res) => {
  console.log("Delete item from route hit");
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.redirect("/login"); // Made this path absolute
    }
    const itemIndex = user.items.indexOf(req.body.itemName);
    if (itemIndex > -1) {
      user.items.splice(itemIndex, 1);
    }
    await user.save();
    res.redirect("/profile");
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).send("Server Error");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
