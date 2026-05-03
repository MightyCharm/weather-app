function getThemeStorage() {
  const theme = JSON.parse(localStorage.getItem("theme"));
  return theme ? theme : false;
}

function setThemeStorage(theme) {
  localStorage.setItem("theme", JSON.stringify(theme));
}

function getDataStorage() {
  const checkData = JSON.parse(localStorage.getItem("data"));
  return checkData ? checkData : false;
}

function setDataStorage(data) {
  localStorage.setItem("data", JSON.stringify(data));
}

function getUnitStorage() {
  const unit = JSON.parse(localStorage.getItem("unit"));
  return unit ? unit : false;
}

function setUnitStorage(unit) {
  localStorage.setItem("unit", JSON.stringify(unit));
}

export {
  getThemeStorage,
  setThemeStorage,
  getDataStorage,
  setDataStorage,
  getUnitStorage,
  setUnitStorage,
};
