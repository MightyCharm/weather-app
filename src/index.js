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
import { getCustomObject } from "./dataProcessor.js";
console.log("====== start program ======");

const body = document.querySelector("body");
// unit & color theme buttons
const btnTempUnit = document.getElementById("btn-temp");
const spanTempUnit = document.getElementById("span-temp");
const btnColorTheme = document.getElementById("btn-color");
const iconTheme = document.querySelector(".icon-theme");
// form input elements
const form = document.getElementById("fetch-form");
const inputForm = document.getElementById("input-search");
const btnSearch = document.getElementById("btn-search");
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
// loading screen
const sectionCurrent = document.getElementById("current-ui");
const sectionForecast = document.getElementById("forecast-ui");
const sectionExtraInformation = document.getElementById("extra-information-ui");
const uiLoading = document.getElementById("loading-ui");
const uiParaLoading = document.getElementById("text-loading");

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
  if (body.getAttribute("data-theme")) {
    setThemeStorage("dark");
  } else {
    setThemeStorage("light");
  }
  setAppTheme();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = getUserInput();
  updateUI(input);
});

inputForm.addEventListener("invalid", () => {
  if (inputForm.validity.valueMissing) {
    inputForm.setCustomValidity("Bitte einen Ort eingeben.");
  }
});

inputForm.addEventListener("input", () => {
  inputForm.setCustomValidity("");
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
  const customData = getDataStorage();
  const unit = getUnitStorage();
  if (!customData) {
    console.log(
      "something went wrong inside applyTemperature Unit, no customData available",
    );
    return;
  }
  if (unit === "celsius") {
    spanTempUnit.textContent = "°C";
    uiTemp.textContent = customData.data.current.temperature;
    uiTempUnit.textContent = "°C";
    uiFeelTemp.textContent = `${customData.data.current.feelslike} °C`;

    customData.data.forecasts.forEach((obj, index) => {
      const card = cardsForecast[index];
      const uiForecastTemps = card.querySelector(".data-forecast-temp");
      uiForecastTemps.textContent = `${obj.minTemp}° - ${obj.maxTemp}°`;
    });
  } else {
    spanTempUnit.textContent = "°F";

    const currTempF = Math.round(
      (customData.data.current.temperature * 9) / 5 + 32,
    );
    const feelTempF = Math.round(
      (customData.data.current.feelslike * 9) / 5 + 32,
    );
    uiTemp.textContent = currTempF;
    uiTempUnit.textContent = "°F";
    uiFeelTemp.textContent = `${feelTempF} °F`;
    customData.data.forecasts.forEach((obj, index) => {
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
  // arg represents browser theme on init or refresh,
  // if true=browser has dark theme, if false=light theme
  // if undefined, call comes from btnColorTheme
  iconTheme.classList.remove("fa-moon");
  iconTheme.classList.remove("fa-sun");
  const theme = getThemeStorage();
  // if no app themewas saved, apply browser theme
  //console.log(`arg: ${arg} theme: ${theme}`);
  if (!theme) {
    if (arg) {
      // dark theme
      body.removeAttribute("data-theme");
      iconTheme.classList.add("fa-moon");
    } else {
      // light theme
      body.setAttribute("data-theme", "light");
      iconTheme.classList.add("fa-sun");
    }
  } else {
    if (theme === "dark") {
      body.removeAttribute("data-theme");
      iconTheme.classList.add("fa-moon");
    } else {
      body.setAttribute("data-theme", "light");
      iconTheme.classList.add("fa-sun");
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

function displayLoadingScreen(show) {
  if (show) {
    sectionCurrent.classList.add("hidden");
    sectionForecast.classList.add("hidden");
    sectionExtraInformation.classList.add("hidden");
    uiLoading.classList.remove("hidden");
    btnSearch.disabled = true;
  } else {
    setTimeout(() => {
      sectionCurrent.classList.remove("hidden");
      sectionForecast.classList.remove("hidden");
      sectionExtraInformation.classList.remove("hidden");
      uiLoading.classList.add("hidden");
      btnSearch.disabled = false;
    }, 2000);
  }
}

function updateMessageLoadingScreen(type) {
  if (type === "loading" || type === "fetch") {
    uiParaLoading.textContent = "Loading...";
  } else if (type === "no-data") {
    setTimeout(() => {
      uiParaLoading.textContent = "No Data available. Please try again...";
    }, 2000);
  }
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
    return false;
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
  const altText = conditions;

  uiResolvedAddress.textContent = `${resolvedAddress}`;
  uiDataDate.textContent = `${weekday}, ${date} | `;
  uiIcon.src = require(`./images/SVG/icons2/${icon}.svg`);
  uiIcon.alt = altText;
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
    const altText = obj.conditions;

    uiWeekday.textContent = obj.weekday;
    uiIcon.src = require(`./images/SVG/icons2/${obj.icon}.svg`);
    uiIcon.alt = altText;
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
  //console.log(data);
  if (isData) {
    const dataAddress = data.data.current.address.toLowerCase();
    //console.log(`dataAddress: ${dataAddress}  input: ${input}`);
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

  console.log(`${isData} ${isSameCity} ${isDataStale}`);
  // new fetch if: no data || another city || data to old
  if (isData === false || isSameCity === false || isDataStale === true) {
    console.log("-> NEW fetch request <---------------------------");
    data = await fetchData(input);

    displayLoadingScreen(true);
    updateMessageLoadingScreen("fetch");
  }
  // check if we have data or not
  if (data) {
    setDataStorage(data);
    updateCurrentUI(data.data);
    updateForecast(data.data.forecasts);
    applyTemperatureUnit();

    displayLoadingScreen(false);
    //updateMessageLoadingScreen("step: we have data");
  } else {
    updateMessageLoadingScreen("no-data");
  }
}

function init() {
  updateMessageLoadingScreen("loading");

  setAppTheme(mediaQueryList.matches);
  initializeTemperaturUnit();
  const initialCall = "New York, US".toLowerCase();

  updateUI(initialCall);
  setInterval(getTime, 1000);
}

init();

// - alt attribute for images
// - implement geo-location to fetch user location at start
// - add check for input, if no input, it shouldn't be fetch

// feat: geolocation
// on page laod -> navigator.geolocation.getCurrentPosition()
// success -> show
// fail -> check localStoage for weather data- display
//      -> no data in localStorage do standard fetch
