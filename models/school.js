const mongoose = require("../db/connection");

const schoolSchema = new mongoose.Schema({
  name: String,
  school: String,
  list: String,
});

const School = new mongoose.model("School", schoolSchema);

module.exports = School;