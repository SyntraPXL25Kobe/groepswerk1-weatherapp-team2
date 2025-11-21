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

  fetch(url)
    .then((res) => {
      if (res.status === 404) {
        throw new Error("CITY_NOT_FOUND");
      }
      if (!res.ok) {
        throw new Error(`API_ERROR (${res.status})`);
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
          displayHomeContent(data);
          break;
      }
    })
    .catch((err) => {
      console.error("Fout:", err);
      handleApiError(err);
    });
}

function displayHomeContent(data) {
  const location = { name: data.name };
  console.log("Weer data ontvangen:", data);
  const currentLocationElement = document.getElementById("currentLocation");
  currentLocationElement.innerText = `${data.name}, ${data.sys.country}`;

  const homeFavorites = document.getElementById("homeFavorites");
  homeFavorites.innerHTML = "";
  const favoritesStorage = getFavoritesFromLocalStorage();
  favoritesStorage.forEach((favorite) => {
    console.log(`Favorieten ${favorite.name}`);
    homeFavorites.innerHTML += `<div class="p-4 rounded-2xl bg-[var(--bg-info)] backdrop-blur-md border border-white/20 shadow-sm cursor-pointer hover:bg-white/30 transition-colors flex justify-between items-center font-semibold">${favorite.name}</div>`;
  });
  favoriteHeart(location);
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

function baseContent(data) {
  const location = { name: data.name };
  const currentLocationElement = document.getElementById("currentLocation");
  const temperatureElement = document.getElementById("temperature");
  const weatherIconElement = document.getElementById("weatherIcon");
  const weatherDescriptionElement =
    document.getElementById("weatherDescription");
  const addToFavoritesButton = document.getElementById("addToFavoritesButton");
  const addToFavoritesCloneButton = addToFavoritesButton.cloneNode(true);

  addToFavoritesButton.parentNode.replaceChild(
    addToFavoritesCloneButton,
    addToFavoritesButton
  );

  addToFavoritesCloneButton.addEventListener("click", () => {
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
}

function displayHomeContent(data) {
  baseContent(data);
  console.log("Weer data ontvangen:", data);

  const homeFavorites = document.getElementById("homeFavorites");
  homeFavorites.innerHTML = "";
  const favoritesStorage = getFavoritesFromLocalStorage();
  favoritesStorage.forEach((favorite) => {
    console.log(`Favorieten ${favorite.name}`);
    homeFavorites.innerHTML += `<div class="p-4 rounded-2xl bg-[var(--bg-info)] backdrop-blur-md border border-white/20 shadow-sm cursor-pointer hover:bg-white/30 transition-colors flex justify-between items-center font-semibold">${favorite.name}</div>`;
  });
}

function displayVampireContent(data) {
  baseContent(data);

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

  localTime.innerHTML = getLocalTimeString(Date.now() / 1000);
  sunriseElement.innerHTML = getLocalTimeString(data.sys.sunrise);
  sunsetElement.innerHTML = getLocalTimeString(data.sys.sunset);

  const currentUtcTime = Math.floor(Date.now() / 1000);
  const isDayTime =
    currentUtcTime >= data.sys.sunrise && currentUtcTime < data.sys.sunset;

  if (isDayTime) {
    vampireAdvice.innerHTML = "⚠️ Gevaar! De zon schijnt. Blijf in je kist!";
    vampireAdvice.style.color = "red";
  } else {
    vampireAdvice.innerHTML = "🧛 Het is veilig. Tijd voor een snack!";
    vampireAdvice.style.color = "green";
  }
}

function displaySurferContent(data) {
  baseContent(data);

  const windSpeedElement = document.getElementById("windSpeed");
  const windDirectionElement = document.getElementById("windDirection");
  const windDirectionArrowElement =
    document.getElementById("windDirectionArrow");

  windSpeedElement.innerText = `${data.wind.speed} km/h`;
  windDirectionElement.innerText = `${data.wind.deg}°`;
  windDirectionArrowElement.style.transform = `rotate(${data.wind.deg}deg)`;
}

function displayGuardianContent(data) {
  baseContent(data);

  const humidityElement = document.getElementById("humidity");
  const excpectedRainElement = document.getElementById("expectedRain");

  excpectedRainElement.innerText = `${data.rain?.["1h"] || 0} mm`;
  humidityElement.innerText = `${data.main.humidity}%`;
}
