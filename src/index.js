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

async function fetchData() {
  try {
    const response = await fetch(
      "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/pforzheim?unitGroup=metric&key=XNT5W4M924BSW324WY2Q8UA4N",
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    console.log(`Successful fetch: ${response.ok} ${response.status}`);
    const data = await response.json();
    localStorage.setItem("data", JSON.stringify(data));
    return data;
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

async function init() {
  console.log("init()");
  let data = JSON.parse(localStorage.getItem("data"));
  if (!data) {
    data = await fetchData();
  }

  if (data) {
    extractData(data);
  } else {
    console.log("No data available");
  }
}

init();
