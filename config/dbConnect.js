const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Verbindung zur Datenbank erfolgreich");
    })
    .catch((err) => {
      console.log("Verbindung zur Datenbank fehlgeschlagen");
      console.error(err);
    });
}

module.exports = dbConnect;
