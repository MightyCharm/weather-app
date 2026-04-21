import "@fortawesome/fontawesome-free/css/all.css";
import "./styles.css";

const APP_VERSION = "1.0.0";
if (localStorage.getItem("app-version") !== APP_VERSION) {
  localStorage.clear();
  localStorage.setItem("app-version", APP_VERSION);
}

const uiAddress = document.getElementById("data-address");
const uiTime = document.getElementById("current-time");
const uiWeekdayDate = document.getElementById("data-weekday-date");
const uiFetchTime = document.getElementById("data-datetime");
const uiIcon = document.getElementById("data-icon");
const uiConditions = document.getElementById("data-conditions");
const uiTemp = document.getElementById("data-temp");
const uiFeelTemp = document.getElementById("data-feelslike");
const uiWind = document.getElementById("data-wind");
const uiHumidity = document.getElementById("data-humidity");
const uiDescription = document.getElementById("data-description");

const inputForm = document.getElementById("search");
const searchButton = document.getElementById("search-btn");

searchButton.addEventListener("click", (event) => {
  event.preventDefault();
  const input = getUserInput();
  updateWeatherUI(input);
});

function getUserInput() {
  const input = inputForm.value.toLowerCase();
  inputForm.value = "";
  return input;
}

function getDataStorage() {
  console.log("function getDataStorage()");
  const checkData = JSON.parse(localStorage.getItem("data"));
  return checkData ? checkData : false;
}

function setDataStorage(data) {
  console.log("function setDataStorage()");
  localStorage.setItem("data", JSON.stringify(data));
}

function processData(data) {
  console.log("function processData()");
  const dataDate = data.days[0].datetime;
  const objDate = new Date(dataDate);
  const date = objDate.toLocaleDateString("de-DE");
  const weekday = objDate.toLocaleDateString("de-DE", { weekday: "long" });
  let customObj = {
    address: data.address,
    date: date,
    weekday: weekday,
    time: data.currentConditions.datetime,
    conditions: data.currentConditions.conditions,
    temperature: data.currentConditions.temp,
    feelslike: data.currentConditions.feelslike,
    humidity: data.currentConditions.humidity,
    windspeed: data.currentConditions.windspeed,
    sunrise: data.currentConditions.sunrise,
    sunset: data.currentConditions.sunset,
    pressure: data.currentConditions.pressure,
    uvindex: data.currentConditions.uvindex,
    description: data.description,
    icon: data.currentConditions.icon,
  };
  return customObj;
}

function getTime() {
  console.log("function getTime()");
  const time = new Date();
  const hours = String(time.getHours()).padStart(2, "0");
  const minutes = String(time.getMinutes()).padStart(2, "0");
  const seconds = String(time.getSeconds()).padStart(2, "0");

  uiTime.textContent = `${hours}:${minutes}:${seconds} Uhr`;
}

async function fetchData(input) {
  console.log("function fetchData() fetches and mdifies the data");
  const city = input;
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=XNT5W4M924BSW324WY2Q8UA4N&lang=de`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    console.log(`Successful fetch: ${response.ok} ${response.status}`);
    const data = await response.json();
    const modifiedData = { data: processData(data), timestamp: Date.now() };
    return modifiedData;
  } catch (error) {
    console.log(error);
  }
}

async function extractData(data) {
  console.log("function extractData()");
  //console.log(data);
  const address = data.address;
  const weekday = data.weekday;
  const date = data.date;

  const fetchTime = data.time;
  const conditions = data.conditions;
  const temperature = data.temperature;
  const feelslike = data.feelslike;
  const humidity = data.humidity;
  const windspeed = data.windspeed;
  //const sunrise = data.sunrise;
  //const sunset = data.sunset;
  //const pressure = data.pressure;
  //const uvindex = data.uvindex;
  const description = data.description;
  const icon = data.icon;

  uiAddress.textContent = address.charAt(0).toUpperCase() + address.slice(1);
  uiWeekdayDate.textContent = `${weekday}, ${date}`;
  uiFetchTime.textContent = `(Updated: ${fetchTime} Uhr)`;
  uiIcon.src = require(`./images/SVG/icons2/${icon}.svg`);
  uiConditions.textContent = conditions;
  uiTemp.textContent = `${temperature} °C`;
  uiFeelTemp.textContent = `${feelslike} °C`;
  uiWind.textContent = `${windspeed} km/h`;
  uiHumidity.textContent = `${humidity} %`;
  uiDescription.textContent = description;
}

async function updateWeatherUI(input) {
  console.log("function updateWeatherUI()");
  let data = getDataStorage(input);
  let isData = false;
  let isSameCity = false;
  let isDataStale = false;
  isData = data ? true : false;

  if (isData) {
    const dataAddress = data.data.address;

    if (dataAddress === input) {
      isSameCity = true;
    }

    const currentTime = Date.now();
    const timestamp = data.timestamp;
    //console.log("timestamp:", timestamp, typeof timestamp);

    const lastFetchMilliSeconds = currentTime - timestamp;
    const lastFetchMinutes = Math.ceil(lastFetchMilliSeconds / 1000 / 60);
    console.log(`last fetch was ${lastFetchMinutes} min ago.`);
    if (lastFetchMinutes > 10) {
      isDataStale = true;
    }
  }

  console.log(
    `final check\nisData: ${isData}\nisSameCity: ${isSameCity}\nisOldData: ${isDataStale}`,
  );
  if (isData === false || isSameCity === false || isDataStale === true) {
    console.log("----->A) NEW fetch request");
    data = await fetchData(input);
    setDataStorage(data);
  }
  extractData(data.data);
}

const initialCall = "New York".toLowerCase();
updateWeatherUI(initialCall);

setInterval(getTime, 1000);
