const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Bitte gib eine Email Adresse an"],
    unique: [true, "Diese Email Adresse existiert bereits"],
  },
  password: {
    type: String,
    required: [true, "Bitte gib ein Passwort ein"],
    unique: false,
  },
});

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);
