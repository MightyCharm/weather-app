import "@fortawesome/fontawesome-free/css/all.css";
import "./styles.css";

const APP_VERSION = "1.0.1";
if (localStorage.getItem("app-version") !== APP_VERSION) {
  localStorage.clear();
  localStorage.setItem("app-version", APP_VERSION);
}

const inputForm = document.getElementById("search");
const searchButton = document.getElementById("search-btn");

const uiResolvedAddress = document.getElementById("address");
const uiCurrentTime = document.getElementById("current-time");
const uiDataDate = document.getElementById("data-date");
const uiIcon = document.getElementById("data-icon");
const uiConditions = document.getElementById("data-conditions");
const uiTemp = document.getElementById("data-temp");
const uiFeelTemp = document.getElementById("data-feelslike");
const uiWind = document.getElementById("data-wind");
const uiHumidity = document.getElementById("data-humidity");
const uiDescription = document.getElementById("data-description");
const uiFetchTime = document.getElementById("data-fetched-time");

searchButton.addEventListener("click", (event) => {
  event.preventDefault();
  const input = getUserInput();
  updateWeatherUI(input);
});

function getUserInput() {
  const input = inputForm.value.toLowerCase().trim();
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
  console.log(data);
  const dataDate = data.days[0].datetime;
  const objDate = new Date(dataDate);
  const date = objDate.toLocaleDateString("de-DE");
  const weekday = objDate.toLocaleDateString("de-DE", { weekday: "long" });
  let customObj = {
    resolvedAddress: capitalizeCityName(data.resolvedAddress),
    date: date,
    weekday: weekday,
    icon: data.currentConditions.icon,
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
    fetchedTime: convertFetchTime(data.currentConditions.datetime),
  };
  return customObj;
}

function convertFetchTime(fetchedTime) {
  console.log("function convertFetchTime()");
  return fetchedTime.substring(0, 5);
}

function getTime() {
  console.log("function getTime()");
  const time = new Date();
  const hours = String(time.getHours()).padStart(2, "0");
  const minutes = String(time.getMinutes()).padStart(2, "0");
  const seconds = String(time.getSeconds()).padStart(2, "0");

  uiCurrentTime.textContent = `${hours}:${minutes}:${seconds}`;
}

function capitalizeCityName(address) {
  console.log("function capitalizeCityName()");
  const arrAddress = address.split(/([ .])/);
  const modifiedAddress = arrAddress
    .map((value) => {
      console.log(value);
      return value.charAt(0).toUpperCase() + value.slice(1);
    })
    .join("");
  return modifiedAddress;
}

async function fetchData(input) {
  console.log("function fetchData() fetches and modifies the data");
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
    const modifiedData = { data: processData(data), timestamp: Date.now() };
    return modifiedData;
  } catch (error) {
    console.log(error);
  }
}

async function updateUI(data) {
  console.log("function updateUI()");
  //console.log(data);
  const resolvedAddress = data.resolvedAddress;
  const weekday = data.weekday;
  const date = data.date;

  const icon = data.icon;

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
  const fetchTime = data.fetchedTime;

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
    //console.log(`last fetch was ${lastFetchMinutes} min ago.`);
    if (lastFetchMinutes > 10) {
      isDataStale = true;
    }
  }

  //console.log(`final check\nisData: ${isData}\nisSameCity: ${isSameCity}\nisOldData: ${isDataStale}`,);
  if (isData === false || isSameCity === false || isDataStale === true) {
    console.log("----->A) NEW fetch request");
    data = await fetchData(input);
    setDataStorage(data);
  }
  updateUI(data.data);
}

const initialCall = "New York, US".toLowerCase();
updateWeatherUI(initialCall);

setInterval(getTime, 1000);
