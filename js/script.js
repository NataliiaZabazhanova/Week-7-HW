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
//function for display days in forecast
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

//---------------------------------------------------------------------------------------------------------------------------------------------
//function to display forecast from js
function displayForecast(response) {
  let forecast = response.data.daily;
  console.log(forecast);
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="forecast__row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="forecast__column column">
    <div class="column__degree">
      <span class="column__max">${Math.round(
        forecastDay.temperature.maximum
      )}°C</span>
      <span class="column__min">${Math.round(
        forecastDay.temperature.minimum
      )}°C</span>
    </div>
    <div class="column__day">${formatDay(forecastDay.time)}</div>
    <div class="column__sky">
       <img src="${forecastDay.condition.icon_url}" alt="${
          forecastDay.condition.icon
        }" />
    </div>
  </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

//-----------------------------------------------------------------------------------------------------
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
  let displayCity = response.data.city;
  newCityDisplay.innerHTML = displayCity;
  //-----------------------------display icon------------------
  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  //-----------------------------display alternative name for  icon------------------
  icon.setAttribute("alt", response.data.condition.icon);
  //-------------------------------------------------------
}
function searchCity(event) {
  event.preventDefault();
  let query = document.querySelector("#search__text");
  //--------------------для відображення погоди--------------------------
  //-------------------------особистий ключ-----------------------------------------
  let key = "bf636449b03206034d0ac2d97t9eo009";
  let currentWeatherUrl = `https://api.shecodes.io/weather/v1/current?query=${query.value}&key=${key}&units=metric`;
  axios.get(currentWeatherUrl).then(function (currentWeatherResponse) {
    let lon = currentWeatherResponse.data.coordinates.longitude;
    let lat = currentWeatherResponse.data.coordinates.latitude;
    let forecastUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${lon}&lat=${lat}&key=${key}&units=metric`;
    axios.get(forecastUrl).then(function (forecastResponse) {
      showWeather(currentWeatherResponse);
      displayForecast(forecastResponse);
    });
  });
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

  let lon = response.data.coordinates.longitude;
  let lat = response.data.coordinates.latitude;
  let key = "bf636449b03206034d0ac2d97t9eo009";
  let forecastUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${lon}&lat=${lat}&key=${key}&units=metric`;
  axios.get(forecastUrl).then(displayForecast);
}

function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let key = "bf636449b03206034d0ac2d97t9eo009";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${key}&units=metric`;

  searchCityByCoordinates(apiUrl);
}

function searchCityByCoordinates(apiUrl) {
  axios.get(apiUrl).then(function (response) {
    showWeather(response);
    let lon = response.data.coordinates.longitude;
    let lat = response.data.coordinates.latitude;
    let forecastUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${lon}&lat=${lat}&key=${key}&units=metric`;
    axios.get(forecastUrl).then(displayForecast);
  });
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
