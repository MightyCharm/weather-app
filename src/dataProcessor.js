function getCustomObject(data) {
  //console.log("getCustomObject(data)");
  //console.log(data);
  // create date object from data array days to create date in germany format and weekday as string
  const dataDate = data.days[0].datetime;
  const objDate = new Date(dataDate);
  const date = objDate.toLocaleDateString("de-DE");
  const weekday = objDate.toLocaleDateString("de-DE", { weekday: "long" });

  const rawForecasts = data.days.slice(1, 7);
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
      address: data.address,
      resolvedAddress: capitalizeCityName(data.resolvedAddress),
      date: date,
      weekday: weekday,
      icon: data.currentConditions.icon,
      conditions: data.currentConditions.conditions,
      temperature: Math.round(data.currentConditions.temp),
      feelslike: Math.round(data.currentConditions.feelslike),
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
  //console.log(`temperature: ${customObj.current.temperature} feelslike: ${customObj.current.feelslike}`);
  return customObj;
}

function convertFetchTime(fetchedTime) {
  return fetchedTime.substring(0, 5);
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

export { getCustomObject };
