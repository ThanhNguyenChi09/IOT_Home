// Import MQTT service
import { MQTTService } from "./mqttService.js";

// Target specific HTML items
const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");

// Holds the background color of all chart
var chartBGColor = getComputedStyle(document.body).getPropertyValue(
  "--chart-background"
);
var chartFontColor = getComputedStyle(document.body).getPropertyValue(
  "--chart-font-color"
);
var chartAxisColor = getComputedStyle(document.body).getPropertyValue(
  "--chart-axis-color"
);

/*
  Event listeners for any HTML click
*/
menuBtn.addEventListener("click", () => {
  sideMenu.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  sideMenu.style.display = "none";
});

themeToggler.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme-variables");
  themeToggler.querySelector("span:nth-child(1)").classList.toggle("active");
  themeToggler.querySelector("span:nth-child(2)").classList.toggle("active");

  // Update Chart background
  chartBGColor = getComputedStyle(document.body).getPropertyValue(
    "--chart-background"
  );
  chartFontColor = getComputedStyle(document.body).getPropertyValue(
    "--chart-font-color"
  );
  chartAxisColor = getComputedStyle(document.body).getPropertyValue(
    "--chart-axis-color"
  );
  updateChartsBackground();
});

/*
  Plotly.js graph and chart setup code
*/
var temperatureHistoryDiv = document.getElementById("temperature-history2");
var humidityHistoryDiv = document.getElementById("humidity-history2");
var lightHistoryDiv = document.getElementById("light-history2");

var temperatureGaugeDiv = document.getElementById("temperature-gauge2");
var humidityGaugeDiv = document.getElementById("humidity-gauge2");
var lightGaugeDiv = document.getElementById("light-gauge2");


const historyCharts = [
  temperatureHistoryDiv,
  humidityHistoryDiv,
  lightHistoryDiv,
];

const gaugeCharts = [
  temperatureGaugeDiv,
  humidityGaugeDiv,
  lightGaugeDiv,
];

// History Data
var temperatureTrace = {
  x: [],
  y: [],
  name: "Temperature",
  mode: "lines+markers",
  type: "line",
};
var humidityTrace = {
  x: [],
  y: [],
  name: "Humidity",
  mode: "lines+markers",
  type: "line",
};
var lightTrace = {
  x: [],
  y: [],
  name: "Light Intensity",
  mode: "lines+markers",
  type: "line",
};


var temperatureLayout = {
  autosize: true,
  title: {
    text: "Temperature",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 10 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
    autorange: true,
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
    autorange: true,
  },
};
var humidityLayout = {
  autosize: true,
  title: {
    text: "Humidity",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
  },
};
var lightLayout = {
  autosize: true,
  title: {
    text: "Light Intensity",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
  },
};
var altitudeLayout = {
  autosize: true,
  title: {
    text: "Altitude",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
  },
};

var config = { responsive: true, displayModeBar: false };

// Event listener when page is loaded
window.addEventListener("load", (event) => {
  Plotly.newPlot(
    temperatureHistoryDiv,
    [temperatureTrace],
    temperatureLayout,
    config
  );
  Plotly.newPlot(humidityHistoryDiv, [humidityTrace], humidityLayout, config);
  Plotly.newPlot(lightHistoryDiv, [lightTrace], lightLayout, config);


  // Get MQTT Connection
  fetchMQTTConnection();

  // Run it initially
  handleDeviceChange(mediaQuery);
});

// Gauge Data
var temperatureData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "Temperature" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 30 },
    gauge: {
      axis: { range: [null, 50] },
      steps: [
        { range: [0, 20], color: "lightgray" },
        { range: [20, 30], color: "gray" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var humidityData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "Humidity" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 50 },
    gauge: {
      axis: { range: [null, 100] },
      steps: [
        { range: [0, 20], color: "lightgray" },
        { range: [20, 30], color: "gray" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var lightData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "Light" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 750 },
    gauge: {
      axis: { range: [null, 1000] },
      steps: [
        { range: [0, 300], color: "lightgray" },
        { range: [300, 700], color: "gray" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var layout = { width: 300, height: 250, margin: { t: 0, b: 0, l: 0, r: 0 } };

Plotly.newPlot(temperatureGaugeDiv, temperatureData, layout);
Plotly.newPlot(humidityGaugeDiv, humidityData, layout);
Plotly.newPlot(lightGaugeDiv, lightData, layout);


// Will hold the arrays we receive from our BME280 sensor
// Temperature
let newTempXArray = [];
let newTempYArray = [];
// Humidity
let newHumidityXArray = [];
let newHumidityYArray = [];
// Liht Intensity
let newLightXArray = [];
let newLightYArray = [];


// The maximum number of data points displayed on our scatter/line graph
let MAX_GRAPH_POINTS = 12;
let ctr = 0;

// Callback function that will retrieve our latest sensor readings and redraw our Gauge with the latest readings
function updateSensorReadings(jsonResponse) {
  let obj2 = {
    ...obj
  }
  console.log(typeof jsonResponse);
  console.log(jsonResponse);

  if (jsonResponse.type == "Temperature") {
    obj2["temperature2"] = Number(jsonResponse.value).toFixed(2);
  }
  if (jsonResponse.type == "Humidity") {
    obj2["humidity2"] = Number(jsonResponse.value).toFixed(2);
  }
  if (jsonResponse.type == "Light_Intensity") {
    obj2["light2"] = Number(jsonResponse.value).toFixed(2);
  }
  if (jsonResponse.type == "Light21") {
    obj2["button1"] = Number(jsonResponse.value);
  }
  if (jsonResponse.type == "Light22") {
    obj2["button2"] = Number(jsonResponse.value);
  }
  if (jsonResponse.type == "Fan2") {
    obj2["button3"] = Number(jsonResponse.value);
  }

  obj = obj2;
  updateBoxes(obj2["temperature2"], obj2["humidity2"], obj2["light2"], obj2["button1"], obj2["button2"], obj2["button3"]);

  updateGauge(obj2["temperature2"], obj2["humidity2"], obj2["light2"]);

  updateGauge(obj2["temperature2"], obj2["humidity2"], obj2["light2"]);

  // Update Temperature Line Chart
  updateCharts(
    temperatureHistoryDiv,
    newTempXArray,
    newTempYArray,
    obj2["temperature2"]
  );
  // Update Humidity Line Chart
  updateCharts(
    humidityHistoryDiv,
    newHumidityXArray,
    newHumidityYArray,
    obj2["humidity2"]
  );
  // Update Light_Intensity Line Chart
  updateCharts(
    lightHistoryDiv,
    newLightXArray,
    newLightYArray,
    obj2["light2"]
  );
}

function updateBoxes(temperature2, humidity2, light2, button1, button2, button3) {
  let temperatureDiv = document.getElementById("temperature2");
  let humidityDiv = document.getElementById("humidity2");
  let lightDiv = document.getElementById("light2");
  let button1Div = document.getElementById("lightSwitch21");
  let button2Div = document.getElementById("lightSwitch22");
  let button3Div = document.getElementById("fanSwitch2");

  temperatureDiv.innerHTML = temperature2 + " °C";
  humidityDiv.innerHTML = humidity2 + " %";
  lightDiv.innerHTML = light2 + " Lux";
  if (button1 === 1) {
    button1Div.innerHTML = "ON";
  } else if(button1 === 0){
    button1Div.innerHTML = "OFF";
  }
  if (button2 === 1) {
    button2Div.innerHTML = "ON";
  } else if(button2 === 0) {
    button2Div.innerHTML = "OFF";
  }
  if (button3 === 1) {
    button3Div.innerHTML = "ON";
  } else if(button3 === 0) {
    button3Div.innerHTML = "OFF";
  }

}

function updateGauge(temperature2, humidity2, light2) {
  var temperature_update = {
    value: temperature2,
  };
  var humidity_update = {
    value: humidity2,
  };
  var light_update = {
    value: light2,
  };

  Plotly.update(temperatureGaugeDiv, temperature_update);
  Plotly.update(humidityGaugeDiv, humidity_update);
  Plotly.update(lightGaugeDiv, light_update);
}

function updateCharts(lineChartDiv, xArray, yArray, sensorRead) {
  if (xArray.length >= MAX_GRAPH_POINTS) {
    xArray.shift();
  }
  if (yArray.length >= MAX_GRAPH_POINTS) {
    yArray.shift();
  }
  xArray.push(ctr++);
  yArray.push(sensorRead);

  var data_update = {
    x: [xArray],
    y: [yArray],
  };

  Plotly.update(lineChartDiv, data_update);
}

function updateChartsBackground() {
  // updates the background color of historical charts
  var updateHistory = {
    plot_bgcolor: chartBGColor,
    paper_bgcolor: chartBGColor,
    font: {
      color: chartFontColor,
    },
    xaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
    yaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
  };
  historyCharts.forEach((chart) => Plotly.relayout(chart, updateHistory));

  // updates the background color of gauge charts
  var gaugeHistory = {
    plot_bgcolor: chartBGColor,
    paper_bgcolor: chartBGColor,
    font: {
      color: chartFontColor,
    },
    xaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
    yaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
  };
  gaugeCharts.forEach((chart) => Plotly.relayout(chart, gaugeHistory));
}

const mediaQuery = window.matchMedia("(max-width: 600px)");

mediaQuery.addEventListener("change", function (e) {
  handleDeviceChange(e);
});

function handleDeviceChange(e) {
  if (e.matches) {
    console.log("Inside Mobile");
    var updateHistory = {
      width: 323,
      height: 250,
      "xaxis.autorange": true,
      "yaxis.autorange": true,
    };
    historyCharts.forEach((chart) => Plotly.relayout(chart, updateHistory));
  } else {
    var updateHistory = {
      width: 550,
      height: 260,
      "xaxis.autorange": true,
      "yaxis.autorange": true,
    };
    historyCharts.forEach((chart) => Plotly.relayout(chart, updateHistory));
  }
}

/*
  MQTT Message Handling Code
*/
const mqttStatus = document.querySelector(".status");

function onConnect(message) {
  mqttStatus.textContent = "Connected";
}

let obj = {
  temperature2: 0,
  humidity2: 0,
  light2: 0,
  button1: 0,
  button2: 0,
  button3: 0
}
function onMessage(topic, message) {
  var stringResponse = message.toString();
  var messageResponse = JSON.parse(stringResponse);

  updateSensorReadings(messageResponse, obj);
}

function onError(error) {
  console.log(`Error encountered :: ${error}`);
  mqttStatus.textContent = "Error";
}

function onClose() {
  console.log(`MQTT connection closed!`);
  mqttStatus.textContent = "Closed";
}

function fetchMQTTConnection() {
  fetch("/mqttConnDetails2", {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then(function (response) {
      return response.json();
      console.log(response)
    })
    .then(function (data) {
      initializeMQTTConnection(data.mqttServer, data.mqttTopic);
    })
    .catch((error) => console.error("Error getting MQTT Connection :", error));
}

var mqttService;
function initializeMQTTConnection(mqttServer, mqttTopic) {
  console.log(
    `Initializing connection to :: ${mqttServer}, topic :: ${mqttTopic}`
  );
  var fnCallbacks = { onConnect, onMessage, onError, onClose };

  mqttService = new MQTTService(mqttServer, fnCallbacks);
  mqttService.connect();

  mqttService.subscribe(mqttTopic);
}

//Light21
const bulb21 = document.getElementById("bulb21");
const lightSwitch21 = document.getElementById("lightSwitch21");
lightSwitch21.innerText = "OFF";
bulb21.addEventListener("change", function () {
  if (this.checked) {
    // Nếu công tắc được bật
    lightSwitch21.innerText = "ON";
    mqttService.publish("device/light21", '1');
  } else {
    // Nếu công tắc được tắt
    lightSwitch21.innerText = "OFF";
    mqttService.publish("device/light21", '0');
  }
});

//Light22
const bulb22 = document.getElementById("bulb22");
const lightSwitch22 = document.getElementById("lightSwitch22");
lightSwitch22.innerText = "OFF";
bulb22.addEventListener("change", function () {
  if (this.checked) {
    // Nếu công tắc được bật
    lightSwitch22.innerText = "ON";
    mqttService.publish("device/light22", '1');
  } else {
    // Nếu công tắc được tắt
    lightSwitch22.innerText = "OFF";
    mqttService.publish("device/light22", '0');
  }
});

//Fan2
const fan2 = document.getElementById("fan2");
const fanSwitch2 = document.getElementById("fanSwitch2");
fanSwitch2.innerText = "OFF";
fan2.addEventListener("change", function () {
  if (this.checked) {
    // Nếu công tắc được bật
    fanSwitch2.innerText = "ON";
    mqttService.publish("device/fan2", '1');
  } else {
    // Nếu công tắc được tắt
    fanSwitch2.innerText = "OFF";
    mqttService.publish("device/fan2", '0');
  }
});

//Mode Switch
const ModeSwitch1 = document.getElementById("ModeSwitch1");
const ModeSwitch = document.getElementById("ModeSwitch");
ModeSwitch1.innerText = "Manual";
ModeSwitch.addEventListener("change", function () {
  if (this.checked) {
    // Nếu công tắc được bật
    ModeSwitch1.innerText = "Auto";
    mqttService.publish("Auto_Mode2", '1');
  } else {
    // Nếu công tắc được tắt
    ModeSwitch1.innerText = "Manual";
    mqttService.publish("Auto_Mode2", '0');
  }
});