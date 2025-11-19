const apiUrl = "https://api.openweathermap.org/data/2.5/weather";
const weatherIconUrl = "https://openweathermap.org/img/wn/";
const apiKey = "38d41c5560fd9cdbd9cd0686d13a47b5";
const defaultLocation = {
  name: "Genk",
};

// We roepen init pas aan als de pagina 'klaar' is met laden
document.addEventListener("DOMContentLoaded", init);

function init() {
  console.log("Pagina is klaar, starten maar!");
  let location = getLocationFromLocalStorage();

  // 1. Navigatie activeren (met veiligheidscheck)
  const userType = document.getElementById("userType");

  userType.addEventListener("change", (event) => {
    userTypeNavigation(event.target.value);
  });

  // 2. Zoekbalk activeren
  setupSearch(userType.value);

  // 3. Weer ophalen (LET OP: aanhalingstekens om de stad!)
  getWeather(location.name, userType.value);
}

// --- LOCAL STORAGE FUNCTIES ---

function getLocationFromLocalStorage() {
  const location = JSON.parse(localStorage.getItem("location"));
  if (location) {
    return location;
  }

  setLocationToLocalStorage(defaultLocation);
}

function setLocationToLocalStorage(location) {
  localStorage.setItem("location", JSON.stringify(location));
}

// --- FUNCTIES ---

function getWeather(cityName, userType) {
  const url = `${apiUrl}?q=${cityName}&appid=${apiKey}&units=metric`;
  const locationTitle = document.getElementById("currentLocation");

  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Stad niet gevonden (${res.status})`);
      }
      return res.json();
    })
    .then((data) => {
      switch (userType) {
        case "vampire":
          dispaplayVampireContent(data);
          break;
        case "guardian":
          displayGuardianContent(data);
          break;
        case "surfer":
          displaySurferContent(data);
          break;
        default:
          displayDefaultContent(data);
          break;
      }
    })
    .catch((err) => {
      console.error("Fout:", err);
      locationTitle.innerText = "Stad niet gevonden 😕";
    });
}

function displayDefaultContent(data) {
  console.log("Weer data ontvangen:", data);
  currentLocation();
}

function setupSearch(userType) {
  const searchInput = document.getElementById("searchInput");

  if (searchInput) {
    searchInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        const city = searchInput.value;
        if (city) {
          console.log(`Zoeken naar: ${city}`);
          getWeather(city, userType);
          setLocationToLocalStorage({ name: city });
          searchInput.value = "";
        }
      }
    });
  }
}

function userTypeNavigation(userType) {
  switch (userType) {
    case "vampire":
      location.assign("vampire.html");
      break;
    case "guardian":
      location.assign("guardian.html");
      break;
    case "surfer":
      location.assign("surfer.html");
      break;
    default:
      location.assign("index.html");
  }
}

function currentLocation() {
  const location = getLocationFromLocalStorage();
  const currentLocationElement = document.getElementById("currentLocation"); // Heb de naam iets aangepast om verwarring te voorkomen

  // IF: Check of location bestaat EN of er een naam in zit
  if (location && location.name) {
    currentLocationElement.innerHTML = `${location.name}`;
  } else {
    // ELSE: Error message of fallback
    currentLocationElement.innerHTML = "Locatie onbekend";
    console.warn("Geen locatie gevonden in local storage!");
  }
}

function displaySurferContent(data) {
  const currentLocationElement = document.getElementById("currentLocation");
  const temperatureElement = document.getElementById("temperature");
  const weatherIconElement = document.getElementById("weatherIcon");
  const weatherDescriptionElement =
    document.getElementById("weatherDescription");
  const windSpeedElement = document.getElementById("windSpeed");
  const windDirectionElement = document.getElementById("windDirection");
  const windDirectionArrowElement =
    document.getElementById("windDirectionArrow");

  currentLocationElement.innerText = `${data.name}, ${data.sys.country}`;
  temperatureElement.innerText = `${Math.round(data.main.temp)}°C`;
  weatherIconElement.style.backgroundImage = `url(${weatherIconUrl}${data.weather[0].icon}@4x.png)`;
  weatherDescriptionElement.innerText = data.weather[0].description;
  windSpeedElement.innerText = `${data.wind.speed} km/h`;
  windDirectionElement.innerText = `${data.wind.deg}°`;
  windDirectionArrowElement.style.transform = `rotate(${data.wind.deg}deg)`;
}

function displayGuardianContent(data) {
  const currentLocationElement = document.getElementById("currentLocation");
  const temperatureElement = document.getElementById("temperature");
  const weatherIconElement = document.getElementById("weatherIcon");
  const weatherDescriptionElement =
    document.getElementById("weatherDescription");
  const humidityElement = document.getElementById("humidity");
  const excpectedRainElement = document.getElementById("expectedRain");

  currentLocation();
  currentLocationElement.innerHTML = `${data.name}, ${data.sys.country}`;
  temperatureElement.innerText = `${Math.round(data.main.temp)}°C`;
  weatherIconElement.style.backgroundImage = `url(${weatherIconUrl}${data.weather[0].icon}@4x.png)`;
  weatherDescriptionElement.innerText = data.weather[0].description;
  excpectedRainElement.innerText = `${data.rain?.["1h"] || 0} mm`;
  humidityElement.innerText = `${data.main.humidity}%`;
}
