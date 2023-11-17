const express = require("express");
const app = express();
const port = 3000;


//DataBase Data Import
const { Client } = require('pg');
const mqtt = require('mqtt');
const mqttClient = mqtt.connect('mqtt://172.20.10.3');

const topic1 = 'SensorData';
const topic2 = 'SensorData2';

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'Sensor_Data',
  password: 'Chithanh09@',
  port: 5432, // default PostgreSQL port
});

client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL');
  })
  .catch((error) => {
    console.error('Error connecting to PostgreSQL:', error);
  });

mqttClient.on('connect', function () {
  console.log('Connected to MQTT Server');
  mqttClient.subscribe(topic1);
  mqttClient.subscribe(topic2);
});

mqttClient.on('message', (topic, message) => {
  const receivedData = JSON.parse(message.toString());
  console.log('Received Data:', receivedData);
  const { device_id, type, value } = receivedData;

  // Câu lệnh SQL INSERT
  const query = `INSERT INTO data_home(device_id, type, value) VALUES('${device_id}', '${type}', '${value}')`;

  // Thực thi câu lệnh SQL
  client.query(query, (err, res) => {
    if (err) {
      console.error(err);
    } else {
      console.log('SQL Sent!!!');
    }
  });
});


//WEBSOCKET ENABLE AND WORKING
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
