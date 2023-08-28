const mongoose = require("../db/connection");

const profileSchema = new mongoose.Schema({
  userId: { ref: "User", type: mongoose.Schema.Types.ObjectId },
  school: [{ ref: "School", type: mongoose.Schema.Types.ObjectId }],
});

const Profile = new mongoose.model("Profile", profileSchema);

module.exports = Profile;
