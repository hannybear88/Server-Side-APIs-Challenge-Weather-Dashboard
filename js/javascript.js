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


