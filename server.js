require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.port || 8000;
const expressEjsLayouts = require("express-ejs-layouts");
const authRoutes = require("./controllers/authController");
const session = require("express-session");
const schoolRouter = require("./controllers/schoolController");

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

// anywhere below middleware
app.use(authRoutes);

app.get("/", (req, res) => {
  res.render("home.ejs");
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
