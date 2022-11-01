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

// Save cityName to localStorage
var savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];

// Set the page up
cityInput.focus();
renderSearchHistory();
getCityWeather(); // Initialize data of the cards

// Set live clock
window.setInterval(function () {
    $('#currentDate').text(moment().utcOffset(timezone/60).format("MMMM Do YYYY, h:mm:ss a"))
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

// Reload a search entry from the history
$(document).on("click", ".btn-secondary", (event) => {
	var savedCity = event.target.innerText;
	cityInput.val(savedCity);

	getCityWeather();

	cityInput.val("");
});

// Clear search history
$(document).on("click", "#clearHistory", (event) => {
	  // Reset savedCities data, then re-render search history
    localStorage.removeItem("savedCities")
    savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
    renderSearchHistory();
});









