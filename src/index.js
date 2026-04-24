import "@fortawesome/fontawesome-free/css/all.css";
import "./styles.css";

const APP_VERSION = "1.2.0";
if (localStorage.getItem("app-version") !== APP_VERSION) {
  localStorage.clear();
  localStorage.setItem("app-version", APP_VERSION);
}

const inputForm = document.getElementById("search");
const searchButton = document.getElementById("search-btn");

// current weather
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

// forecast
const cardsForecast = document.querySelectorAll(".card-forecast");

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
  const checkData = JSON.parse(localStorage.getItem("data"));
  return checkData ? checkData : false;
}

function setDataStorage(data) {
  localStorage.setItem("data", JSON.stringify(data));
}

function processData(data) {
  //console.log(data);
  const dataDate = data.days[0].datetime;
  const objDate = new Date(dataDate);
  const date = objDate.toLocaleDateString("de-DE");
  const weekday = objDate.toLocaleDateString("de-DE", { weekday: "long" });

  const rawForecasts = data.days.slice(1, 7);
  //console.log(rawForecasts);
  const modifiedForecasts = rawForecasts.map((obj) => {
    const date = new Date(obj.datetime);
    const day = date.toLocaleDateString("de-DE", { weekday: "long" });
    return {
      weekday: day,
      icon: obj.icon,
      minTemp: Math.round(obj.tempmin),
      maxTemp: Math.round(obj.tempmax),
      conditions: obj.conditions,
    };
  });

  let customObj = {
    current: {
      resolvedAddress: capitalizeCityName(data.resolvedAddress),
      date: date,
      weekday: weekday,
      icon: data.currentConditions.icon,
      conditions: data.currentConditions.conditions,
      temperature: Math.round(data.currentConditions.temp),
      feelslike: data.currentConditions.feelslike,
      humidity: data.currentConditions.humidity,
      windspeed: data.currentConditions.windspeed,
      sunrise: data.currentConditions.sunrise,
      sunset: data.currentConditions.sunset,
      pressure: data.currentConditions.pressure,
      uvindex: data.currentConditions.uvindex,
      description: data.description,
      fetchedTime: convertFetchTime(data.currentConditions.datetime),
    },
    forecasts: modifiedForecasts,
  };
  //console.log(customObj);
  return customObj;
}

function convertFetchTime(fetchedTime) {
  return fetchedTime.substring(0, 5);
}

function getTime() {
  const time = new Date();
  const hours = String(time.getHours()).padStart(2, "0");
  const minutes = String(time.getMinutes()).padStart(2, "0");
  const seconds = String(time.getSeconds()).padStart(2, "0");

  uiCurrentTime.textContent = `${hours}:${minutes}:${seconds}`;
}

function capitalizeCityName(address) {
  const arrAddress = address.split(/([ .])/);
  const modifiedAddress = arrAddress
    .map((value) => {
      return value.charAt(0).toUpperCase() + value.slice(1);
    })
    .join("");
  return modifiedAddress;
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
    const modifiedData = { data: processData(data), timestamp: Date.now() };
    return modifiedData;
  } catch (error) {
    console.log(error);
  }
}

async function updateCurrentWeatherUI(data) {
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

async function updateForecastUI(data) {
  console.log("function updateForecast()");
  console.log(data);
  data.forEach((obj, index) => {
    const card = cardsForecast[index];
    console.log(card);
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

async function updateWeatherUI(input) {
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
  //console.log(data);
  updateCurrentWeatherUI(data.data);
  updateForecastUI(data.data.forecasts);
}

console.log("start ================");
const initialCall = "New York, US".toLowerCase();
updateWeatherUI(initialCall);

setInterval(getTime, 1000);
