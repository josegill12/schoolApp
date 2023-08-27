const mongoose = require("../db/connection");

const profileSchema = new mongoose.Schema({
  userId: { ref: "User", type: mongoose.Schema.Types.ObjectId },
  school: [{ ref: "School", type: mongoose.Schema.Types.ObjectId }],
  isComplete: Boolean,
  total: Number,
});

const Profile = new mongoose.model("Profile", profileSchema);

module.exports = Profile;
