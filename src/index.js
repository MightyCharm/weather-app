import "@fortawesome/fontawesome-free/css/all.css";
import "./styles.css";

// `./images/SVG/icons2/${icon}.svg`
// https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/london?key=11111111111111111

/*
const icon = data.currentConditions.icon;
element.src = require(`./images/SVG/icons2/${icon}.svg`);   
*/

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
    const modifiedData = { data: data, timestamp: Date.now() };
    return modifiedData;
  } catch (error) {
    console.log(error);
  }
}

async function extractData(data) {
  //const data = await getWeatherData();
  console.log(data);
  const address = data.address;

  const fetchedDate = data.days[0].datetime;
  const objDate = new Date(fetchedDate);
  const date = objDate.toLocaleDateString("de-DE");
  const weekday = objDate.toLocaleDateString("en-EN", { weekday: "long" });

  const time = data.currentConditions.datetime;
  const conditions = data.currentConditions.conditions;
  const temperature = data.currentConditions.temp;
  const feelslike = data.currentConditions.feelslike;
  const humidity = data.currentConditions.humidity;
  const windspeed = data.currentConditions.windspeed;
  const sunrise = data.currentConditions.sunrise;
  const sunset = data.currentConditions.sunset;
  const pressure = data.currentConditions.pressure;
  const uvindex = data.currentConditions.uvindex;
  const description = data.description;
  const icon = data.currentConditions.icon;

  /*
  console.log(`address: ${address}`);
  console.log(`date: ${date}`);
  console.log(`datetime: ${time}`);
  console.log(`conditions: ${conditions}`);
  console.log(`icon: ${icon}`);
  console.log(`temperature: ${temperature}`);
  console.log(`feelslike: ${feelslike}`);
  console.log(`humidity: ${humidity}`);
  console.log(`windspeed: ${windspeed}`);
  console.log(`sunrise: ${sunrise}`);
  console.log(`sunset: ${sunset}`);
  console.log(`pressure: ${pressure}`);
  console.log(`uvindex: ${uvindex}`);

  console.log(`description: ${description}`);
  */
  uiAddress.textContent = address.charAt(0).toUpperCase() + address.slice(1);
  uiDate.textContent = `${date}`;
  uiTime.textContent = `${time} Uhr`;
  uiDay.textContent = `${weekday}`;
  uiIcon.src = require(`./images/SVG/icons2/${icon}.svg`);
  uiConditions.textContent = conditions;
  uiTemp.textContent = `${temperature} °C`;
  uiFeelTemp.textContent = `${feelslike} °C`;
  uiWind.textContent = `${windspeed} km/h`;
  uiHumidity.textContent = `${humidity} %`;
  uiDescription.textContent = description;
}

function getDataStorage() {
  console.log("function getDataStorage()");
  const checkData = JSON.parse(localStorage.getItem("data"));
  return checkData ? checkData : false;
}

function setDataStorage(data) {
  console.log("function setDataStoarage()");
  localStorage.setItem("data", JSON.stringify(data));
}

async function updateWeatherUI(input) {
  console.log("function updateWeatherUI_beta()");
  let data = getDataStorage(input);
  let isData = false;
  let isSameCity = false;
  let isDataStale = false;

  console.log("data:", data);
  isData = data ? true : false;
  console.log("isData", isData);

  if (isData) {
    console.log("--> A)");
    const dataAddress = data.data.address;
    console.log("dataAddress:", dataAddress);

    if (dataAddress === input) {
      isSameCity = true;
    }

    const currentTime = Date.now();
    const timestamp = data.timestamp;
    console.log("timestamp:", timestamp, typeof timestamp);

    const lastFetchMilliSeconds = currentTime - timestamp;
    const lastFetchMinutes = Math.ceil(lastFetchMilliSeconds / 1000 / 60);
    console.log(lastFetchMinutes, lastFetchMilliSeconds);
    if (lastFetchMinutes > 10) {
      isDataStale = true;
    }
  }

  console.log(
    `final check\nisData: ${isData}\nisSameCity: ${isSameCity}\nisOldData: ${isDataStale}`,
  );
  if (isData === false || isSameCity === false || isDataStale === true) {
    console.log("new fetch request");
    data = await fetchData(input);
    setDataStorage(data);
  }
  extractData(data.data);
}

const input = "pforzheim".toLowerCase();
updateWeatherUI(input);
