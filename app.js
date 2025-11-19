const apiUrl = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = "38d41c5560fd9cdbd9cd0686d13a47b5";

// Wacht tot de HTML structuur klaar is
document.addEventListener("DOMContentLoaded", () => {
    console.log("Pagina is klaar, starten maar!");
    
    userTypeNavigation(); 
    setupSearch();
    
    // START: Haal direct het weer op voor Genk (of je defaultLocation)
    getWeather("Genk");
});


// --- FUNCTIES ---

function getWeather(cityName) {
    // De URL dynamisch bouwen
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
    
    // TIP: Hier kun je straks de HTML gaan vullen
    // Bijvoorbeeld:
    // document.querySelector('h2').innerText = data.name;
    // document.querySelector('#temp').innerText = Math.round(data.main.temp) + '°C';
}

function setupSearch() {
    // ZORG DAT JE INPUT IN HTML OOK ECHT id="searchInput" HEEFT!
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
    } else {
        console.error("Kan zoekbalk niet vinden! Check je HTML id.");
    }
}

function userTypeNavigation(){
    const userType = document.getElementById('userType'); // <--- DEZE MISTE JE
    
    if (userType) {
        userType.addEventListener('change', function() {
            const value = this.value;
            // Switch is netter, maar jouw if/else mag ook
            switch(value) {
                case 'vampire': location.assign('vampire.html'); break;
                case 'guardian': location.assign('guardian.html'); break;
                case 'surfer': location.assign('surfer.html'); break;
                default: location.assign('index.html');
            }
        });
    }
}