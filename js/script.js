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

	//  Convert cityName to cityCoords (in lat and lon) via Geocoding
	const cityToCoords = await fetch(geocodingCall);
	const coords = await cityToCoords.json();
	if (coords.length === 0) {
		alert("City not found");
		return;
	}
	console.log(coords);    // DEBUG LINE

	var latCurrent = coords[0].lat;
	var lonCurrent = coords[0].lon;
	var cityName = coords[0].name;
  var stateName = coords[0].state;
	var countryName = countryNames.of(coords[0].country);


		// Adjust state name if it isn't provide
		if (typeof stateName !== 'undefined') {
			stateName = ", " + stateName;
		} else {
			stateName = "";
		}

	var currentWeatherCall = `https://api.openweathermap.org/data/2.5/weather?lat=${latCurrent}&lon=${lonCurrent}&appid=${APIkey}`;
	const getCurrentWeather = await fetch(currentWeatherCall);
	const currentWeather = await getCurrentWeather.json();
	timezone = currentWeather.timezone;


	//  Update City Name and Date (Weather Based Icon)
	var cityTitle = $("#currentCity");
  	var currentState = $("#currentState");
	var currentCountry = $("#country");
	var currentDate = $("#currentDate");
	cityTitle.text(cityName);
  	currentState.text(stateName);
	currentCountry.text(countryName);
	// console.log(currentWeather);    // DEBUG LINE

	// Manage custom background
	if (ENABLE_CUSTOM_BACKGROUND) {
		var body = $("body");
		var weatherDesc = currentWeather.weather[0].main;
		var bgrSource = `url(assets/images/${getCustomBackgroundSrc(weatherDesc)})`;
		body.css("background-image", bgrSource);
	}

	// Set date then update card data
	var today = moment()
		.utcOffset(currentWeather.timezone / 60)
		.format("MMMM Do YYYY, h:mm:ss a");
	currentDate.text(today);
	formatTempCard(currentWeather, "", "");
	formatTempCardTime(currentWeather, "");

	/*******************************************************************/
	/*  Acceptance Criteria #2                                    */
	/*WHEN I view current weather conditions for that city*/
	/*THEN I am presented with the city name, the date, an icon representation of weather conditions, */
	/*the temperature, the humidity, and the the wind speed*/
	/*******************************************************************/


	/*******************************************************************/
	/*  Acceptance Criteria #3                                    */
	/*  WHEN I view future weather conditions for that city            */
	/*  THEN I am presented with a 5-day forecast that displays        */
	/*  the date, an icon representation of weather conditions,        */
	/*  the temperature, and the humidity
	 /*******************************************************************/


	// Daily/Hourly Forecast Section
	// Api to get 5-day/3-hours forecast

	var forecastCall = `http://api.openweathermap.org/data/2.5/forecast?lat=${latCurrent}&lon=${lonCurrent}&appid=${APIkey}`;

	// console.log(forecastCall)    //DEBUG: Check if query returns anything
	$.ajax({
		url: forecastCall,
		method: "GET",
	}).then(function (response5day) {
		console.log(response5day);
		$("#boxes").empty();

		// Get 5 entries of forecast
		// Indexes are 3 hours apart, so increment i by 8 for a full day
		var fiveDayWeatherArray = [];
		for (var i = 0, j = 0; j < 5; i = i + 8) {
			fiveDayWeatherArray.push(response5day.list[i]);
			var weatherData = response5day.list[i];
			if (response5day.list[i].dt != response5day.list[i + 1].dt) {
				formatTempCard(weatherData, "-daily", j);
				j++;
			}
		}


    // Get entries of tomorrow's 3-hourly forecast
    for (var i = 0; i < 8; i = i + 1) {
      var nHourlyWeatherData = response5day.list[i];
      formatTempCard(nHourlyWeatherData, "-hourly", i);
    }
	});
}
// challenging myself beginning - adding sunset and surise
// Format time for the cards
function formatTempCardTime(cityData, index) {

  // Set times and timezones for current weather card
  var getTimezone = $(`#timezone`); // Local timezone
  var displayTimezone = moment.unix(timezone).utcOffset(0).format("H:mm");
  getTimezone.text(displayTimezone);

  var getSunrise = $(`#${index}-sunrise-time`); // Sunrise Time
  var sunrise = moment(cityData.sys.sunrise, "X")
    .utcOffset(timezone / 60)
    .format("h:mm a");
  getSunrise.text(sunrise);

  var getSunset = $(`#${index}-sunset-time`); // Sunset time
  var sunset = moment(cityData.sys.sunset, "X")
    .utcOffset(timezone / 60)
    .format("h:mm a");
  getSunset.text(sunset);
}
// challenging myself end - adding sunset and sunrise

// Format the cards depending on their index
function formatTempCard(dayData, cardType, index) {
  // console.log(dayData); // DEBUG LINE

  // Check if this is the current weather card
  var isCurrentWeatherCard = false;
  if (index === "") {
    isCurrentWeatherCard = true;
  }

  const cardID = `${index}${cardType}`;

  // Set the day or the hour, depending on cardType
  if (cardType === "-daily") {
    var getDay = $(`#${cardID}-day`);
    var convertedDay = moment(dayData.dt, "X")
      .utcOffset(timezone / 60)
      .format("dddd,<br/>MMM Do");
    getDay.html(convertedDay);
  } else if (cardType === "-hourly") {
    var getHour = $(`#${cardID}-hour`);
    var convertedHour = moment(dayData.dt, "X")
      .utcOffset(timezone / 60)
      .format("hh:mm a");
    getHour.text(convertedHour);
  }

  // Set weather icon
  var getIcon = $(`#${cardID}-img`);
  var iconURL = "";
  var skyconditions = dayData.weather[0].main;
  if (ENABLE_CUSTOM_ICONS) {

	// Use custom icons
    iconURL = getCustomIconSrc(skyconditions);
  }

  // Use icons from OSM if custom icon isn't enabled or no icons is set for the condition
  if (!ENABLE_CUSTOM_ICONS || iconURL === "") {
    iconURL = `http://openweathermap.org/img/wn/${dayData.weather[0].icon}.png`;
  }
  console.log(cardType + "     " + iconURL);		// DEBUG LINE;
  getIcon.attr("style", "width: 4rem; height: 4rem");
  getIcon.attr("src", iconURL);
  getIcon.attr("alt", skyconditions);



  // Set the weather data
  var getTemp = $(`#${cardID}-temp`);
  var convertedTemp = "";
  convertedTemp = Math.round(
    ((parseInt(dayData.main.temp) - 273.15) * 9) / 5 + 32
  );
  getTemp.text(convertedTemp);

  var getFeelsLike = $(`#${cardID}-feels-like`);
  var calcFeel = Math.round(
    ((parseInt(dayData.main.feels_like) - 273.15) * 9) / 5 + 32
  );
  getFeelsLike.text(calcFeel);

  var getWind = $(`#${cardID}-wind-speed`);
  var windSpeed = dayData.wind.speed;
  getWind.text(windSpeed);

  var getHumid = $(`#${cardID}-humidity`);
  var humid = dayData.main.humidity;
  getHumid.text(humid);

  var getRain = $(`#${cardID}-rain`);
  var rain = "";
  try {
    if (typeof dayData.rain === 'undefined') {
      throw error;
    }
    rain = dayData.rain["1h"] + " mm";
  } catch (error) {

    // no rain data is found
    rain = "No Data";
  }
  getRain.text(rain);

  var getMaxTemp = $(`#${cardID}-highest-temp`);
  var maxTemp = "";
  maxTemp = Math.round(
    ((parseInt(dayData.main.temp_max) - 273.15) * 9) / 5 + 32
  );
  getMaxTemp.text(maxTemp);

  var getMinTemp = $(`#${cardID}-lowest-temp`);
  var minTemp = "";
  minTemp = Math.round(
    ((parseInt(dayData.main.temp_min) - 273.15) * 9) / 5 + 32
  );
  getMinTemp.text(minTemp);

  if (!isCurrentWeatherCard) {

		// Get rain probability for forecast card
    var getRainProb = $(`#${cardID}-rain-prob`);
    var rainProb = (dayData.pop * 100).toFixed(0);
    getRainProb.text(rainProb);
  }
}




function saveTheCity() {

  // Disable saving the search on start up
  if (isPageStartup) {
		isPageStartup = false;
    return;
  }


	//  Add new Button with current City Name as text and value
	var thisCity = cityInput.val().trim();
	if (thisCity != "" && savedCities.indexOf(thisCity) === -1) {
		savedCities.unshift(thisCity);
	} else {
		cityInput.val("");
		cityInput.attr("placeholder", "City name...");
	}
	localStorage.setItem("savedCities", JSON.stringify(savedCities));
}

function renderSearchHistory() {
	var getHistory = $("#searchHistory");
	getHistory.empty();

  // console.log(savedCities) // DEBUG LINE
	for (city of savedCities) {
		var newBtnGroup = $(
			'<div class="btn-group d-flex align-items-stretch my-2" role="group" aria-label="City Button">'
		);
		var newBtn = $(
			`<button class="btn btn-secondary p-0 fs-6 w-75" style="opacity:0.7;">`
		);
		var closeBtn = $(
			`<button type="button" class="btn btn-close p-3 fs-6 bg-secondary" aria-label="Close">`
		);

		newBtn.text(city);
		newBtnGroup.append(newBtn);
		newBtnGroup.append(closeBtn);
		getHistory.append(newBtnGroup);
	}
}

	
