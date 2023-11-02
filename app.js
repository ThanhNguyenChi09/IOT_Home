const express = require("express");
const app = express();
const port = 3000;

// load dotenv to read environment variables
require("dotenv").config();

// template view engine
app.set("view engine", "ejs");

// Serve Static Files
app.use(express.static("public"));

const room1Dashboard = require("./routes/room1");
const room2Dashboard = require("./routes/room2");

app.get("/mqttConnDetails1", (req, res) => {
  res.send(
    JSON.stringify({
      mqttServer: process.env.MQTT_BROKER,
      mqttTopic: process.env.MQTT_TOPIC1,
    })
  );
});

app.get("/mqttConnDetails2", (req, res) => {
  res.send(
    JSON.stringify({
      mqttServer: process.env.MQTT_BROKER,
      mqttTopic: process.env.MQTT_TOPIC2,
    })
  );
});

app.get("/room1", room1Dashboard);
app.get("/room2", room2Dashboard);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
