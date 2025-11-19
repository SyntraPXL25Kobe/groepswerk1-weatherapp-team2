const apiUrl = "https://api.openweathermap.org/data/2.5/weather";
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
  if (userType) {
    userType.addEventListener("change", (event) => {
      userTypeNavigation(event.target.value);
    });
  }

  // 2. Zoekbalk activeren
  setupSearch();

  // 3. Weer ophalen (LET OP: aanhalingstekens om de stad!)
  getWeather(location.name);

  currentLocation();

}

// --- LOCAL STORAGE FUNCTIES ---

function getLocationFromLocalStorage() {
    const location = JSON.parse(localStorage.getItem("location"));
    if(location){   
        return location;
    }

    setLocationToLocalStorage(defaultLocation);
}

function setLocationToLocalStorage(location) {
  localStorage.setItem("location", JSON.stringify(location));
}

// --- FUNCTIES ---

function getWeather(cityName) {
  const url = `${apiUrl}?q=${cityName}&appid=${apiKey}&units=metric`;
  const locationTitle = document.getElementById('currentLocation');

  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Stad niet gevonden (${res.status})`);
      }
      return res.json();
    })
    .then((data) => display(data))
    .catch((err) => {
        console.error("Fout:", err);
        locationTitle.innerText = "Stad niet gevonden 😕";
    });
}

function display(data) {
    console.log("Weer data ontvangen:", data);
    currentLocation();
}

function setupSearch() {
  const searchInput = document.getElementById("searchInput");

  if (searchInput) {
    searchInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        const city = searchInput.value;
        if (city) {
          console.log(`Zoeken naar: ${city}`);
          getWeather(city);
          setLocationToLocalStorage({name:city})
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

function currentLocation(){
    const location = getLocationFromLocalStorage();
    const currentLocationElement = document.getElementById('currentLocation'); // Heb de naam iets aangepast om verwarring te voorkomen

    // IF: Check of location bestaat EN of er een naam in zit
    if (location && location.name) {
        currentLocationElement.innerHTML = `${location.name}`;
    } 
    else {
        // ELSE: Error message of fallback
        currentLocationElement.innerHTML = "Locatie onbekend";
        console.warn("Geen locatie gevonden in local storage!");
    }
}