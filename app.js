const apiUrl = "https://api.openweathermap.org/data/2.5/weather";
const iconUrl = "https://openweathermap.org/img/wn/";
const apiKey = "38d41c5560fd9cdbd9cd0686d13a47b5";
const defaultLocation = {
  city: "Genk",
  country: "BE",
};

function init() {
  const userType = document.getElementById("userType");

  userType.addEventListener("change", (event) => {
    userTypeNavigation(event.target.value);
  });
}

// STAP 1: Maak de volledige URL met parameters
// We voegen '&units=metric' toe zodat je Graden Celsius krijgt i.p.v. Kelvin
const url = `${apiUrl}?q=${defaultLocation.city},${defaultLocation.country}&appid=${apiKey}&units=metric`;

// STAP 2: Fetch met de volledige URL
fetch(url)
  .then((res) => {
    // Check even of het antwoord wel OK is (bijv. geen 404)
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  })
  .then((data) => display(data))
  .catch((err) => console.error("Er ging iets mis:", err));

function display(data) {
  // STAP 3: Geen aanhalingstekens, we willen de inhoud van de variabele zien
  console.log(data);
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

init();
