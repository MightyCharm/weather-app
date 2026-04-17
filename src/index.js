import "@fortawesome/fontawesome-free/css/all.css";
import "./styles.css";

// https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/london?key=11111111111111111

async function fetchData() {
  try {
    const response = await fetch(
      "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/pforzheim?key=XNT5W4M924BSW324WY2Q8UA4N",
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
  const address = data.address;
  const datetime = data.currentConditions.datetime;
  const condition = data.currentConditions.conditions;
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
  console.log(`datetime: ${datetime}`);
  console.log(`conditions: ${condition}`);
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
