const mongoose = require("../db/connection");

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  items: [
    {
      type: String,
    },
  ],
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
