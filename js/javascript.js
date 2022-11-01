// Constants
var APIkey = "3f1cab551e8d4185d8486ab763d9b25b";
const ENABLE_CUSTOM_ICONS = true;
const ENABLE_CUSTOM_BACKGROUND = true;

// Global Vars
var isPageStartup = true;
var timezone = 0;

const countryNames = new Intl.DisplayNames(
	// Get country name from code
	["en"],
	{ type: "region" }
);

// To enable custom weather icons
var customIconSrc = {
	Clouds: "https://img.icons8.com/color/48/000000/cloud.png",
	Clear: "https://img.icons8.com/color/48/000000/summer.png",
	Rain: "https://img.icons8.com/color/48/000000/rain.png",
};

function getCustomIconSrc(key) {
	if (!(key in customIconSrc)) {
		return "";
	}
	return customIconSrc[key];
}

// To enable custom background icons
var customBackgroundSrc = {
	Thunderstorm: "thunderstorm.jpg",
	Drizzle: "drizzle.jpg",
	Rain: "rain.jpg",
	Snow: "snow.jpg",
	Clear: "clear.jpg",
	Clouds: "clouds.jpg",
};

function getCustomBackgroundSrc(key) {
	if (!(key in customBackgroundSrc)) {
		// Belongs to atmosphere group
		return "wind.jpg";
	}
	return customBackgroundSrc[key];
}

// Get cityName from Search Input on SearchBtn Click
var cityInput = $("#cityName");
var searchBtn = $("#searchBtn");
var clearBtn = $("#clearHistory");
var savedBtns = $('button[class*="btn-secondary"]');



/*******************************************************************/
/*  Acceptance Criteria #1.2*/         
/*that city is added to the search history*/
/*******************************************************************/


// Save cityName to localStorage
var savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];

// Set the page up
cityInput.focus();
renderSearchHistory();
getCityWeather(); // Initialize data of the cards

// Set live clock
window.setInterval(function () {
    $('#currentDate').text(moment().utcOffset(timezone/60).format("MMMM Do YYYY, dddd, h:mm:ss a"))
}, 1000);

// Set up buttons
searchBtn.click(() => {
	getCityWeather();
	saveTheCity();
	renderSearchHistory();
});

cityInput.keydown((event) => {
	if (event.which == 13) {
		getCityWeather();
		saveTheCity();
		renderSearchHistory();
	}
});

// Delete a search entry from the history
$(document).on("click", ".btn-close", (event) => {
	var thisCity = event.target;
	var parentEl = thisCity.parentElement;

	for (var i = 0; i < savedCities.length; i++) {
		if (parentEl.innerText === savedCities[i]) {
			savedCities.splice(i, 1);
		}
	}

	localStorage.setItem("savedCities", JSON.stringify(savedCities));
	parentEl.remove();
});


/*******************************************************************/
/*  Acceptance Criteria #4                                    */
/*WHEN I click on a city in the search history*/
/*THEN I am again presented with current and future conditions for that city*/
 /*******************************************************************/

// Reload a search entry from the history
$(document).on("click", ".btn-secondary", (event) => {
	var savedCity = event.target.innerText;
	cityInput.val(savedCity);

	getCityWeather();

	cityInput.val("");
});

// challenging myself beginning - adding clear history button 
// Clear search history
$(document).on("click", "#clearHistory", (event) => {
	  // Reset savedCities data, then re-render search history 
    localStorage.removeItem("savedCities")
    savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
    renderSearchHistory();
});
// challenging myself end - adding clear history button 

/*******************************************************************/
/*  Acceptance Criteria #1.1*/
/*WHEN I search for a city*/
/*THEN I am presented with current and future conditions for that city and*/    
/*******************************************************************/


/*-----> Acceptance Critera 1.2 that city is added to the search history LINEs 56-69 <--------*/

/*******************************************************************/
/*  Acceptance Criteria #2                                    */
/*WHEN I view current weather conditions for that city*/
/*THEN I am presented with the city name, the date, an icon representation of weather conditions, */
/*the temperature, the humidity, and the the wind speed*/
/*******************************************************************/


// Functions Section

// Search Weather Api with cityCoords
async function getCityWeather() {
	var cityValue = cityInput.val().replace(/\s/g, "+");
	if (isPageStartup) {
		// Load Rowland Heights, CA on page start up
		cityValue = "Rowland Heights";
    	isPageStartup = false;
	}
	// console.log(cityValue);   // DEBUG LINE
	var geocodingCall =
		"http://api.openweathermap.org/geo/1.0/direct?q=" +
		cityValue +
		"&limit=5&appid=" +
		APIkey;



