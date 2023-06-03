//-------------------------showing current date---------------------------------
let now = new Date();
let h2 = document.querySelector("#date__now");

let hours = now.getHours();
let minutes = now.getMinutes();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];
h2.innerHTML = `${day}  ${hours} : ${minutes}`;
//----------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------
//display the name of the city on the result page and the current temperature of the city.
function showWeather(response) {
  //отримала дані про погоду у місті, що введено у пошуку
  console.log(response.data);
  let newTemp = document.querySelector("#value__tempC");
  newTemp.innerHTML = Math.round(response.data.temperature.current);
  //--------------------вологість----------------------------------------
  document.querySelector(
    "#humidity"
  ).innerHTML = `${response.data.temperature.humidity} %`;
  //--------------------вітер-----------------------------------
  document.querySelector("#wind").innerHTML = `${Math.round(
    response.data.wind.speed
  )} km/h`;
  //---------------------weather description----------------
  document.querySelector("#desc").innerHTML =
    response.data.condition.description;
  //-------------------відобразим назву міста---------------------------------
  let newCityDisplay = document.querySelector("div.currentCity__city");
  newCityDisplay.innerHTML = response.data.city;
  //-----------------------------display icon------------------
  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  //-----------------------------display alternative name for  icon------------------
  icon.setAttribute("alt", response.data.condition.icon);
}

function searchCity(event) {
  event.preventDefault();
  let query = document.querySelector("#search__text");
  //--------------------для відображення погоди--------------------------
  //-------------------------особистий ключ-----------------------------------------
  let key = "bf636449b03206034d0ac2d97t9eo009";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${query.value}&key=${key}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}
let form = document.querySelector("form");
form.addEventListener("submit", searchCity);
//------------------------------------------------------------------------------------------------------
//-------------------------------додаємо відображення погода за геолокацією------------------------------
function currentWeatherGeo(response) {
  let currentTempGeo = Math.round(response.data.temperature.current);
  let tempGeo = document.querySelector("#value__tempC");
  tempGeo.innerHTML = currentTempGeo;
  //---------------------------humidity---------------------------------------
  document.querySelector(
    "#humidity"
  ).innerHTML = `${response.data.temperature.humidity} %`;
  //-----------------------------вітер-----------------------------------------------
  document.querySelector("#wind").innerHTML = `${Math.round(
    response.data.wind.speed
  )} km/h`;
  //---------------------weather description----------------
  document.querySelector("#desc").innerHTML =
    response.data.condition.description;
  //-----------------------display city name--------------------------------
  let cityGeo = document.querySelector("div.currentCity__city");
  cityGeo.innerHTML = response.data.city;
  //-----------------------------display icon------------------
  let iconGeo = document.querySelector("#icon");
  iconGeo.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  //-----------------------------display alternative name for  icon------------------
  iconGeo.setAttribute("alt", response.data.condition.icon);
}

function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  console.log(lat);
  console.log(lon);
  let key = "bf636449b03206034d0ac2d97t9eo009";
  let apiURL = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${key}&units=metric`;

  axios.get(apiURL).then(currentWeatherGeo);
}
function searchGeo() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

let button = document.querySelector("#geolocation");
button.addEventListener("click", searchGeo);

//--------------------------------Unit conversion-------------------------------------------------------------------
function calcTempC() {
  let tempC = document.querySelector("#value__tempC");
  let unit = tempC.dataset.unit;
  let temp = parseInt(tempC.innerText);
  if (unit === "fahrenheit") {
    let temp2 = Math.round(((temp - 32) * 5) / 9);
    tempC.dataset.unit = "celsius";
    tempC.innerHTML = temp2;
  } else {
    tempC.innerHTML = temp;
  }
}

function calcTempF() {
  let tempC = document.querySelector("#value__tempC");
  let unit = tempC.dataset.unit;
  let temp = parseInt(tempC.innerText);
  if (unit === "celsius") {
    let temp1 = Math.round((temp * 9) / 5 + 32);
    tempC.dataset.unit = "fahrenheit";
    tempC.innerHTML = temp1;
  } else {
    tempC.innerHTML = temp;
  }
}

let tempCelsius = document.querySelector("#value__C");
tempCelsius.addEventListener("click", calcTempC);

let tempFahrenheit = document.querySelector("#value__F");
tempFahrenheit.addEventListener("click", calcTempF);
