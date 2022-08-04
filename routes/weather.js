const express = require("express");
const router = express.Router();

const fetch = require("node-fetch");

router.get("/weather/:city", async (req, res) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${req.params.city}&appid=${process.env.WEATHER_API_KEY}&units=metric`,
  );
  const data = await response.json();
  res.json(data);
});
module.exports = router;
