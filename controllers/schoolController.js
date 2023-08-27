const express = require("express");
const router = express.Router();
const School = require("../models/school");
const Profile = require("../models/profile");

router.get("/", async (req, res) => {
  let school = await School.find();
  res.render("schools/index.ejs", { schools });
});
// an array for this example
router.get("seed", async (req, res) => {
  await Profile.deleteMany({});
  await School.deleteMany({});
  let seededSchools = await School.create([
    {
      id: 1,
      name: "Arrowhead Elementary School",
      Address: "19100 E Bates Ave, Aurora, CO 80013",
      Hours: "Closed-Opens 7:45 AM Thu",
      Phone: "(720) 886-2800",
      District: "Cherry Creek School District 5",
      Lowest_grade: "Pre-kindergarten",
      Highest_grade: "Fifth Grade",
    },
    {
      id: 2,
      name: "Side Creek Elementary School",
      Address: "19191 E Iliff Ave, Aurora, CO 80013",
      Hours: "Closed-Opens 7:45 AM Thu",
      Phone: "(303) 755-1785",
      District: "Adams-Arapahoe School District 28J",
      Lowest_grade: "Pre-kindergarten",
      Highest_grade: "Fifth Grade",
    },
    {
      id: 3,
      name: "Dalton Elementary School",
      Address: "17401 E Darhmouth Ave, Aurora, CO 80013",
      Hours: "Closed-Opens 7:45 AM Thu",
      Phone: "(303) 693-7561",
      District: "Adams-Arapahoe School District 28J",
      Lowest_grade: "Pre-kindergarten",
      Highest_grade: "Fifth Grade",
    },
    {
      id: 4,
      name: "Dartmouth Elementary School",
      Address: "3050 S Laredo St, Aurora, CO 80013",
      Hours: "Closed-Opens 7:45 AM Thu",
      Phone: "(303) 690-1155",
      District: "Cherry Creek School District 5",
      Lowest_grade: "Pre-kindergarten",
      Highest_grade: "Fifth Grade",
    },
    {
      id: 5,
      name: "Vassar",
      Address: "18101 E Vassar Pl, Aurora, CO 80013",
      Hours: "Closed-Opens 7:45 AM Thu",
      Phone: "(303) 752-3772",
      District: "Adams-Araphoe School District 28J",
      Lowest_grade: "Pre-kindergarten",
      Highest_grade: "Fifth Grade",
    },
  ]);
});

// View for grades
router.get("/grades/:id", (req, res) => {
  const grades = [
    {
      id: 1,
      grade: "K",
      materials: [
        "pencil",
        "paper",
        "pink eraser",
        "colored pencils",
        "two pocket folders",
      ],
    },
    {
      grade: "First",
      materials: [
        "pencil",
        "paper",
        "Kids blunt tip scissors",
        " A box of gallon size ziploc bags",
        "Elmer’s glue sticks",
        "Washable markers",
      ],
    },
    {
      grade: "Second",
      materials: [
        "pencil",
        "paper",
        "BackPack",
        "Five Star Comp notebook",
        "Kleenex facial tissues",
        "Hand Sanitizer",
      ],
    },
    {
      grade: "Third",
      materials: [
        "pencil",
        "paper",
        "index cards",
        "wide ruled looseleaf paper",
        "Different colored folders",
        "Pencil case",
        "Ruler",
      ],
    },
    {
      grade: "Fourth",
      materials: [
        "Pencils (#2) and a good eraser",
        "Colored pencils",
        "Pens (blue, black, and possibly red)",
        "Highlighters",
        "Dry erase markers",
        "Pencil sharpener (manual with lid)",
      ],
    },
    {
      grade: "Fifth",
      materials: [
        "Crayons",
        "Washable markers",
        "Watercolor paint set",
        "Glue sticks and white glue",
        "Scissors (safety scissors)",
      ],
    },
  ];
  res.render("schools/grades.ejs", { grades });
});

let school = [];

router.get("/", async (req, res) => {
  const user = {};
  res.render("profiles/profile.ejs", { user, schools });
});
// GET route to show grades for a specific school
router.get("/grades/:id", async (req, res) => {
  const schoolId = parseInt(req.params.id, 10);
  const school = await schools.find((s) => s.id === schoolId);

  if (!school) {
    return res.status(404).send("School not found");
  }
  const grades = [];
  res.render("schools/grades.ejs", { grades, school });
});

// POST route to add a new school
router.post("/add-school", async (req, res) => {
  const schoolId = parseInt(req.body.schoolId, 10);
  const schoolToAdd = schools.find((school) => school.id === schoolId);

  if (!schoolToAdd) {
    return res.status(404).send("School not found");
  }

  res.redirect("/");
});

router.post("/add", (req, res) => {
  if (
    !req.body.name ||
    !req.body.Address ||
    !req.body.Hours ||
    !req.body.Phone ||
    !req.body.District ||
    !req.body.Lowest_grade ||
    !req.body.Highest_grade
  ) {
    return res.status(400).send("All school fields are required.");
  }

  const newSchool = {
    id: Date.now(),
    name: req.body.name,
    Address: req.body.Address,
    Hours: req.body.Hours,
    Phone: req.body.Phone,
    District: req.body.District,
    Lowest_grade: req.body.Lowest_grade,
    Highest_grade: req.body.Highest_grade,
  };

  schools.push(newSchool);

  res.status(201).redirect("/");
});

module.exports = router;
