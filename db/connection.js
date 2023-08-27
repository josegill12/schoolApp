require("dotenv").config();

const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://josegill1988:Popoff12@cluster0.vhrerpo.mongodb.net/labs"
);

mongoose.connection.on("connected", () => console.log("Neo were conneccted"));
mongoose.connection.on("error", () => console.log("Agent Smith stopped you"));

module.exports = mongoose;
