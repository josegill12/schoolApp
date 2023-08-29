require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.port || 8000;
const expressEjsLayouts = require("express-ejs-layouts");
const authRoutes = require("./controllers/authController");
const session = require("express-session");
const schoolRouter = require("./controllers/schoolController");
const morgan = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
//middlewares

app.use(expressEjsLayouts);
app.use(express.static("public"));
app.use(
  // one hour login time
  session({ secret: "somestringreandomdwd", cookie: { maxAge: 3600000 } })
);

// withoutt express.urlencode we cannot use form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(morgan("dev"));

// anywhere below middleware
app.use(authRoutes);

app.get("/", (req, res) => {
  res.render("home.ejs");
});
app.post("/auth/profile/add-school", async (req, res) => {
  const { schoolName } = req.body;

  if (schoolName) {
    try {
      const user = await User.findById(req.session.userId);

      if (user) {
        // Create a new school object with the provided name and address
        const newSchool = {
          name: schoolName,
        };

        // Add the new school to the user's schools array
        user.schools.push(newSchool);

        // Save the updated user profile
        await user.save();

        res.redirect("profile");
      } else {
        res.status(404).send("User not found.");
      }
    } catch (error) {
      res.status(500).send("Error adding school.");
    }
  } else {
    res.status(400).send("School name and address are required.");
  }
});

app.post("/auth/profile/delete-school", async (req, res) => {
  if (req.body.schoolId) {
    try {
      await School.findByIdAndRemove(req.body.schoolId);
      res.redirect("profile");
    } catch (error) {
      res.status(500).send("Error deleting school.");
    }
  } else {
    res.status(400).send("School ID is required to delete.");
  }
});
app.post("/auth/profile/edit", function (req, res) {
  const { name } = req.query;

  if (!name) {
    return res.status(400).send("Name parameter is missing");
  }

  const sanitized = name.replace(/-/g, "");
  res.redirect("/profile/" + sanitized);
});
// define our own middle to check for loggin user
// if no user go to login screen
app.use((req, res, next) => {
  if (!req.session.userId) {
    res.redirect("/login");
    return;
  }
  next();
});
app.use("/school", schoolRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Somethings not right NEO");
});

app.listen(PORT, () => console.log("Your in the Matrix"));
