import "@fortawesome/fontawesome-free/css/all.css";
import "./styles.css";
import {
  getThemeStorage,
  setThemeStorage,
  getDataStorage,
  setDataStorage,
  getUnitStorage,
  setUnitStorage,
} from "./storage.js";
import { getCustomObject, customData } from "./dataProcessor.js";

const APP_VERSION = "1.2.1";
if (localStorage.getItem("app-version") !== APP_VERSION) {
  localStorage.clear();
  localStorage.setItem("app-version", APP_VERSION);
}

const body = document.querySelector("body");
// unit & color theme buttons
const btnTempUnit = document.getElementById("btn-temp");
const btnColorTheme = document.getElementById("btn-color");
// form input elements
const inputForm = document.getElementById("search");
const searchButton = document.getElementById("search-btn");
// current weather
const uiResolvedAddress = document.getElementById("address");
const uiCurrentTime = document.getElementById("current-time");
const uiDataDate = document.getElementById("data-date");
const uiIcon = document.getElementById("data-icon");
const uiConditions = document.getElementById("data-conditions");
const uiTemp = document.getElementById("data-temp");
const uiTempUnit = document.getElementById("current-temp-unit");
const uiFeelTemp = document.getElementById("data-feelslike");
const uiWind = document.getElementById("data-wind");
const uiHumidity = document.getElementById("data-humidity");
const uiDescription = document.getElementById("data-description");
const uiFetchTime = document.getElementById("data-fetched-time");
// forecast
const cardsForecast = document.querySelectorAll(".card-forecast");
// get object for checking if dark theme is selected
const mediaQueryList = window.matchMedia("(prefers-color-scheme:dark");
mediaQueryList.addEventListener("change", () => {
  setAppTheme(mediaQueryList.matches);
});

btnTempUnit.addEventListener("click", () => {
  toggleTemperatureUnit();
  applyTemperatureUnit();
});

btnColorTheme.addEventListener("click", () => {
  console.log(body.getAttribute("data-theme"));
  if (body.getAttribute("data-theme")) {
    setThemeStorage("dark");
  } else {
    setThemeStorage("light");
  }
  setAppTheme();
});

searchButton.addEventListener("click", (event) => {
  event.preventDefault();
  const input = getUserInput();
  updateUI(input);
});

function toggleTemperatureUnit() {
  const unit = getUnitStorage();
  if (unit === "celsius") {
    setUnitStorage("fahrenheit");
  } else {
    setUnitStorage("celsius");
  }
}

function applyTemperatureUnit() {
  console.log("applyTemperatureUnit()");
  //console.log(customData);
  const unit = getUnitStorage();
  if (unit === "celsius") {
    btnTempUnit.textContent = "°C";
    uiTemp.textContent = customData.current.temperature;
    uiTempUnit.textContent = "°C";
    uiFeelTemp.textContent = `${customData.current.feelslike} °C`;

    customData.forecasts.forEach((obj, index) => {
      const card = cardsForecast[index];
      const uiForecastTemps = card.querySelector(".data-forecast-temp");
      uiForecastTemps.textContent = `${obj.minTemp}° - ${obj.maxTemp}°`;
    });
  } else {
    btnTempUnit.textContent = "°F";

    const currTempF = Math.round((customData.current.temperature * 9) / 5 + 32);
    const feelTempF = Math.round((customData.current.feelslike * 9) / 5 + 32);
    uiTemp.textContent = currTempF;
    uiTempUnit.textContent = "°F";
    uiFeelTemp.textContent = `${feelTempF} °F`;
    customData.forecasts.forEach((obj, index) => {
      const minF = Math.round((obj.minTemp * 9) / 5 + 32);
      const maxF = Math.round((obj.maxTemp * 9) / 5 + 32);

      const card = cardsForecast[index];
      const uiTemp = card.querySelector(".data-forecast-temp");
      uiTemp.textContent = `${minF}° - ${maxF}°`;
    });
  }
}

function initializeTemperaturUnit() {
  const tempUnit = getUnitStorage();
  if (tempUnit !== "celsius" && tempUnit !== "fahrenheit") {
    setUnitStorage("celsius");
  }
}

function setAppTheme(arg) {
  const theme = getThemeStorage();
  // if no app theme was saved, apply browser theme
  if (!theme) {
    if (arg) {
      body.removeAttribute("data-theme");
    } else {
      body.setAttribute("data-theme", "light");
    }
  } else {
    if (theme === "light") {
      body.setAttribute("data-theme", "light");
    } else {
      body.removeAttribute("data-theme");
    }
  }
}

function getUserInput() {
  const input = inputForm.value.toLowerCase().trim();
  inputForm.value = "";
  return input;
}

function getTime() {
  const time = new Date();
  const hours = String(time.getHours()).padStart(2, "0");
  const minutes = String(time.getMinutes()).padStart(2, "0");
  const seconds = String(time.getSeconds()).padStart(2, "0");

  uiCurrentTime.textContent = `${hours}:${minutes}:${seconds}`;
}

async function fetchData(input) {
  const city = input;
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=XNT5W4M924BSW324WY2Q8UA4N&lang=de`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    //console.log(`Successful fetch: ${response.ok} ${response.status}`);
    const data = await response.json();
    // console.log(data);
    const modifiedData = { data: getCustomObject(data), timestamp: Date.now() };
    return modifiedData;
  } catch (error) {
    console.log(error);
  }
}

async function updateCurrentUI(data) {
  //console.log(data);
  const resolvedAddress = data.current.resolvedAddress;
  const weekday = data.current.weekday;
  const date = data.current.date;

  const icon = data.current.icon;

  const conditions = data.current.conditions;
  const temperature = data.current.temperature;
  const feelslike = data.current.feelslike;
  const humidity = data.current.humidity;
  const windspeed = data.current.windspeed;
  //const sunrise = data.current.sunrise;
  //const sunset = data.current.sunset;
  //const pressure = data.current.pressure;
  //const uvindex = data.current.uvindex;
  const description = data.current.description;
  const fetchTime = data.current.fetchedTime;

  uiResolvedAddress.textContent = `${resolvedAddress}`;
  uiDataDate.textContent = `${weekday}, ${date} | `;
  uiIcon.src = require(`./images/SVG/icons2/${icon}.svg`);
  uiConditions.textContent = conditions;
  uiTemp.textContent = `${temperature}`;
  uiFeelTemp.textContent = `${feelslike} °C`;
  uiWind.textContent = `${windspeed} km/h`;
  uiHumidity.textContent = `${humidity} %`;
  uiDescription.textContent = description;
  uiFetchTime.textContent = `data last updated: ${fetchTime} Uhr`;
}

async function updateForecast(data) {
  // console.log(data);
  data.forEach((obj, index) => {
    const card = cardsForecast[index];
    const uiWeekday = card.querySelector(".data-forecast-weekday");
    const uiIcon = card.querySelector(".data-forecast-icon");
    const uiTemp = card.querySelector(".data-forecast-temp");
    const uiConditions = card.querySelector(".data-forecast-conditions");

    uiWeekday.textContent = obj.weekday;
    uiIcon.src = require(`./images/SVG/icons2/${obj.icon}.svg`);
    uiTemp.textContent = `${obj.minTemp}° - ${obj.maxTemp}°`;
    uiConditions.textContent = obj.conditions;
  });
}

async function updateUI(input) {
  let data = getDataStorage(input);
  let isData = false;
  let isSameCity = false;
  let isDataStale = false;
  isData = data ? true : false;
  console.log(data);
  if (isData) {
    const dataAddress = data.data.current.resolvedAddress.toLowerCase();
    console.log(`dataAddress: ${dataAddress}  input: ${input}`);
    if (dataAddress === input) {
      isSameCity = true;
    }

    const currentTime = Date.now();
    const timestamp = data.timestamp;
    //console.log("timestamp:", timestamp, typeof timestamp);

    const lastFetchMilliSeconds = currentTime - timestamp;
    const lastFetchMinutes = Math.ceil(lastFetchMilliSeconds / 1000 / 60);
    //console.log(`last fetch was ${lastFetchMinutes} min ago.`);
    if (lastFetchMinutes > 10) {
      isDataStale = true;
    }
  }

  console.log(
    `isData: ${isData}   isSameCity: ${isSameCity}  isDataStale: ${isDataStale}`,
  );
  if (isData === false || isSameCity === false || isDataStale === true) {
    console.log("-----> A) NEW fetch request");
    data = await fetchData(input);
    setDataStorage(data);
  }
  updateCurrentUI(data.data);
  updateForecast(data.data.forecasts);
  applyTemperatureUnit();
}

function init() {
  console.log("====== start program ======");
  setAppTheme(mediaQueryList.matches);
  initializeTemperaturUnit();
  const initialCall = "New York, US".toLowerCase();

  updateUI(initialCall);
  setInterval(getTime, 1000);
}

init();

// - check for fetch doesn't work anymore because resolvedAddress can be different from input "isSameCity"
// - if fetch not successfull, add logic in catch
// - btn theme needs to toggle its icon
