const mongoose = require("../db/connection");
const Schema = mongoose.Schema;

const schoolSchema = Schema({
  name: String,
  school: String,
  list: String,
});

const School = mongoose.model("School", schoolSchema);

module.exports = School;
