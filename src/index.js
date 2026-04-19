import "@fortawesome/fontawesome-free/css/all.css";
import "./styles.css";

const uiAddress = document.querySelector("#data-address");
const uiDate = document.querySelector("#data-date");
const uiTime = document.querySelector("#data-datetime");
const uiDay = document.querySelector("#data-weekday");
const uiIcon = document.querySelector("#data-icon");
const uiConditions = document.querySelector("#data-conditions");
const uiTemp = document.querySelector("#data-temp");
const uiFeelTemp = document.querySelector("#data-feelslike");
const uiWind = document.querySelector("#data-wind");
const uiHumidity = document.querySelector("#data-humidity");
const uiDescription = document.querySelector("#data-description");

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
  const weekday = objDate.toLocaleDateString("en-EN", { weekday: "long" });
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

async function fetchData(input) {
  console.log("function fetchData() fetches and mdifies the data");
  const city = input;
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=XNT5W4M924BSW324WY2Q8UA4N`,
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

  const date = data.date;
  const weekday = data.weekday;

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
  uiDate.textContent = `${date}`;
  uiTime.textContent = `${fetchTime} Uhr`;
  uiDay.textContent = `${weekday}`;
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

const input = "Pforzheim".toLowerCase();
updateWeatherUI(input);
