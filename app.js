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
  return defaultLocation;
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
          displayVampireContent(data);
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
  const searchButton = document.getElementById("searchButton");

  searchButton.addEventListener("click", function () {
    const city = searchInput.value;
    if (city) {
      console.log(`Zoeken naar: ${city}`);
      getWeather(city, userType);
      setLocationToLocalStorage({ name: city });
      searchInput.value = "";
    }
  });

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

function getFavoritesFromLocalStorage() {
  const favorites = JSON.parse(localStorage.getItem("favorites"));
  if (favorites) {
    return favorites;
  }
  return [];
}

function addToFavorites(location) {
  const favorites = getFavoritesFromLocalStorage();

  favorites.push(location);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function removeFromFavorites(location) {
  const favorites = getFavoritesFromLocalStorage();
  const updatedFavorites = favorites.filter(
    (fav) => fav.name !== location.name
  );
  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
}

function isFavorite(location) {
  const favorites = getFavoritesFromLocalStorage();
  return favorites.some((fav) => fav.name === location.name);
}

function displayVampireContent(data) {
  const currentLocationElement = document.getElementById("currentLocation");
  const temperatureElement = document.getElementById("temperature");
  const weatherIconElement = document.getElementById("weatherIcon");
  const weatherDescriptionElement = document.getElementById("weatherDescription");
  const sunriseElement = document.getElementById("sunriseHour");
  const sunsetElement = document.getElementById("sunsetHour");
  const vampireAdvice = document.getElementById("vampireAdvice");
  const localTime = document.getElementById("localTime");

  const timezoneOffset = data.timezone;

  const getLocalTimeString = (timestamp) => {
    const localDate = new Date((timestamp + timezoneOffset) * 1000);
    return localDate.toLocaleTimeString("nl-BE", {
      timeZone: "UTC",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  currentLocationElement.innerText = `${data.name}, ${data.sys.country}`;
  temperatureElement.innerText = `${Math.round(data.main.temp)}°C`;
  weatherIconElement.style.backgroundImage = `url(${weatherIconUrl}${data.weather[0].icon}@4x.png)`;
  weatherDescriptionElement.innerText = data.weather[0].description;

  localTime.innerHTML = getLocalTimeString(Date.now() /1000);
  sunriseElement.innerHTML = getLocalTimeString(data.sys.sunrise);
  sunsetElement.innerHTML = getLocalTimeString(data.sys.sunset);

  const currentUtcTime = Math.floor(Date.now() / 1000);
  const isDayTime = currentUtcTime >= data.sys.sunrise && currentUtcTime < data.sys.sunset;

  if (isDayTime) {
    vampireAdvice.innerHTML = "⚠️ Gevaar! De zon schijnt. Blijf in je kist!";
    vampireAdvice.style.color = "red";
  } else {
    vampireAdvice.innerHTML = "🧛 Het is veilig. Tijd voor een snack!";
    vampireAdvice.style.color = "green";
  }
}

function displaySurferContent(data) {
  const location = { name: data.name };
  const currentLocationElement = document.getElementById("currentLocation");
  const temperatureElement = document.getElementById("temperature");
  const weatherIconElement = document.getElementById("weatherIcon");
  const weatherDescriptionElement =
    document.getElementById("weatherDescription");
  const windSpeedElement = document.getElementById("windSpeed");
  const windDirectionElement = document.getElementById("windDirection");
  const windDirectionArrowElement =
    document.getElementById("windDirectionArrow");
  const addToFavoritesButton = document.getElementById("addToFavoritesButton");

  const cloneButton = addToFavoritesButton.cloneNode(true);

  addToFavoritesButton.parentNode.replaceChild(
    cloneButton,
    addToFavoritesButton
  );

  cloneButton.addEventListener("click", () => {
    if (isFavorite(location)) {
      removeFromFavorites(location);
      favoriteIconElement.style.fill = "none";
    } else {
      addToFavorites(location);
      favoriteIconElement.style.fill = "#fb2c36";
    }
  });

  const favoriteIconElement = document.getElementById("favoriteIcon");

  if (isFavorite(location)) {
    favoriteIconElement.style.fill = "#fb2c36";
  } else {
    favoriteIconElement.style.fill = "none";
  }

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
