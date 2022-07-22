const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();

const dbConnect = require("./config/dbConnect");
const User = require("./schema/userModel");

const auth = require("./config/auth");

dbConnect();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  next();
});

app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/register", (req, res) => {
  console.log(req.body);
  bcrypt
    .hash(req.body.password, 10)
    .then((hashedPassword) => {
      const user = new User({
        email: req.body.email,
        password: hashedPassword,
      });
      user
        .save()
        .then((result) => {
          res.status(201).send({
            message: "User wurde erfolgfreich erstellt",
            result,
          });
        })
        .catch((err) => {
          res.status(500).send({
            message: "Nutzer existiert bereits",
            err,
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Passwort nicht erfolgreich gehashed",
        err,
      });
    });
});

app.post("/login", (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      bcrypt
        .compare(req.body.password, user.password)
        .then((passwordCheck) => {
          if (!passwordCheck) {
            return res.status(400).send({
              message: "Passwort stimmt nicht überein",
              err,
            });
          }

          const token = jwt.sign(
            {
              userId: user.email,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" },
          );

          res.status(200).send({
            message: "Login erfolgreich",
            token,
          });
        })
        .catch((err) => {
          res.status(400).send({
            message: "Passwort stimmt nicht überein",
            err,
          });
        });
    })
    .catch((err) => {
      res.status(404).send({
        message: "Email nicht gefunden",
        err,
      });
    });
});

app.get("/free-endpoint", (req, res) => {
  res.json({ message: "Du befindest dich im /free-endpoint" });
});
app.get("/auth-endpoint", auth, (req, res) => {
  res.json({ message: "Du befindest dich im /auth-endpoint" });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
