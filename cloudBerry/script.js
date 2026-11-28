const searchForm = document.querySelector("form.search");
const searchBox = document.getElementById("search-box");
const mainresult = document.getElementById("mainresult");
const humidityValueElement = document.getElementById("humidity-value");
const windValueElement = document.getElementById("wind-value");
const feelsValueElement = document.getElementById("feels-value");
const temperatureElement = document.getElementById("temperature");
const weatherDescription = document.getElementById("weather-description");
const cityNameElement = document.getElementById("city-name");
const mainFeelsLikeElement = document.getElementById("main-feels-like");

function getWeatherDescription(weatherCode) {
  switch (weatherCode) {
    case 0:
      return "Clear Sky ☀️";
    case 1:
      return "Mainly Clear 🌤️";
    case 2:
      return "Partly Cloudy ⛅";
    case 3:
      return "Overcast ☁️";
    case 45:
      return "Fog 🌫️";
    case 48:
      return "Depositing Rime Fog 🌫️";
    case 51:
      return "Light Drizzle 🌦️";
    case 53:
      return "Moderate Drizzle 🌦️";
    case 55:
      return "Dense Drizzle 🌧️";
    case 56:
      return "Light Freezing Drizzle 🧊";
    case 57:
      return "Dense Freezing Drizzle 🧊";
    case 61:
      return "Slight Rain 🌧️";
    case 63:
      return "Moderate Rain 🌧️";
    case 65:
      return "Heavy Rain 🌧️";
    case 66:
      return "Light Freezing Rain 🧊";
    case 67:
      return "Heavy Freezing Rain 🧊";
    case 71:
      return "Slight Snowfall 🌨️";
    case 73:
      return "Moderate Snowfall ❄️";
    case 75:
      return "Heavy Snowfall ❄️";
    case 77:
      return "Snow Grains 🌨️";
    case 80:
      return "Slight Rain Showers 🌦️";
    case 81:
      return "Moderate Rain Showers 🌧️";
    case 82:
      return "Violent Rain Showers ⛈️";
    case 85:
      return "Slight Snow Showers 🌨️";
    case 86:
      return "Heavy Snow Showers ❄️";
    case 95:
      return "Thunderstorm ⛈️";
    case 96:
      return "Thunderstorm With Slight Hail ⛈️";
    case 99:
      return "Thunderstorm With Heavy Hail ⛈️";
    default:
      return "Unknown Weather ❓";
  }
}

searchForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const city = searchBox.value.trim();
  if (!city) {
    weatherDescription.innerText = "Please enter a city ☁️";
    return;
  }
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
  );
  const stats = await response.json();

  if (!stats.results || stats.results.length === 0) {
    weatherDescription.innerText = "City not found! Try another city ☁️";
    return;
  }

  const matchedCity = stats.results[0];

  if (city.toLowerCase() !== matchedCity.name.toLowerCase()) {
    weatherDescription.innerText = "City not found! Try another city ☁️";
    return;
  }

  const latitude = stats.results[0].latitude;
  const longitude = stats.results[0].longitude;

  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`,
  );

  const weatherData = await weatherResponse.json();
  const currentWeather = weatherData.current;
  const temperature = currentWeather.temperature_2m;
  const feelsLike = currentWeather.apparent_temperature;
  const weatherCode = currentWeather.weather_code;
  const humidityValue = currentWeather.relative_humidity_2m;
  const windSpeedValue = currentWeather.wind_speed_10m;

  cityNameElement.innerText = `${matchedCity.name}, ${matchedCity.country}`;
  temperatureElement.innerText = `${temperature}°C`;
  weatherDescription.innerText = getWeatherDescription(weatherCode);
  mainFeelsLikeElement.innerText = `${feelsLike}°C`;
  humidityValueElement.innerText = humidityValue;
  windValueElement.innerText = windSpeedValue;
  feelsValueElement.innerText = feelsLike;
});
