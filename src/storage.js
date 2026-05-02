function setThemeStorage(theme) {
  localStorage.setItem("theme", JSON.stringify(theme));
}

function getThemeStorage() {
  return JSON.parse(localStorage.getItem("theme"));
}

function getDataStorage() {
  const checkData = JSON.parse(localStorage.getItem("data"));
  return checkData ? checkData : false;
}

function setDataStorage(data) {
  localStorage.setItem("data", JSON.stringify(data));
}
// ------------------------------------------------------------------

function setUnitStorage(unit) {
  localStorage.setItem("unit", JSON.stringify(unit));
}

function getUnitStorage() {
  return JSON.parse(localStorage.getItem("unit"));
}

export {
  getThemeStorage,
  setThemeStorage,
  getDataStorage,
  setDataStorage,
  getUnitStorage,
  setUnitStorage,
};
