const apiUrl = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = "38d41c5560fd9cdbd9cd0686d13a47b5";

// We roepen init pas aan als de pagina 'klaar' is met laden
document.addEventListener("DOMContentLoaded", init);

function init() {
    console.log("Pagina is klaar, starten maar!");

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
    getWeather("Genk");
}


// --- FUNCTIES ---

function getWeather(cityName) {
    const url = `${apiUrl}?q=${cityName}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Stad niet gevonden (${res.status})`);
            }
            return res.json();
        })
        .then(data => display(data))
        .catch(err => console.error("Fout bij ophalen weer:", err));
}

function display(data){
    console.log("Weer data ontvangen:", data); 
    
    // Hier gaan we straks de HTML vullen
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                const city = searchInput.value; 
                if (city) {
                    console.log(`Zoeken naar: ${city}`);
                    getWeather(city); 
                    searchInput.value = ''; 
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