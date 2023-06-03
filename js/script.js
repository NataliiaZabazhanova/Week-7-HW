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
  //---------------------global variable celsiusTemperature for unit conversation-------
  celsiusTemperature = response.data.temperature.current;
  newTemp.innerHTML = Math.round(celsiusTemperature);
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
  celsiusTemperature = response.data.temperature.current;
  let tempGeo = document.querySelector("#value__tempC");
  tempGeo.innerHTML = Math.round(celsiusTemperature);
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
  //-----------------------------display alternative name for icon------------------
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
//----------------------------------------------------------------------------------------------------------------------
//--------------------------------Unit conversion-------------------------------------------------------------------
//---------------------from Celsius to Fahrenheit---------------------------------------------------
function calcTempFahrenheit(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#value__tempC");
  //------remove the active class---------------
  tempCelsius.classList.remove("active");
  //------add active class---------------
  tempFahrenheit.classList.add("active");
  //--------------------------------------------
  let tempFahrenheitCalc = (celsiusTemperature * 9) / 5 + 32;
  tempElement.innerHTML = Math.round(tempFahrenheitCalc);
}
//---------------------global variable celsiusTemperature for unit conversation-------
let celsiusTemperature = null;
//---------------------------------------------------------------------------------------------
let tempFahrenheit = document.querySelector("#value__F");
tempFahrenheit.addEventListener("click", calcTempFahrenheit);
//--------------------------------------------------------------------------------------------
//---------------------from Fahrenheit to Celsius----------------------------------------------
function calcTempCelsius(event) {
  event.preventDefault();
  //------remove the active class---------------
  tempFahrenheit.classList.remove("active");
  //------add active class---------------
  tempCelsius.classList.add("active");
  //--------------------------------------------
  let tempElement = document.querySelector("#value__tempC");
  tempElement.innerHTML = Math.round(celsiusTemperature);
}

let tempCelsius = document.querySelector("#value__C");
tempCelsius.addEventListener("click", calcTempCelsius);
