// Global variables
var searchHistory = ["Houston", "Chicago", "Denver"];
var weatherApiRootUrl = 'https://api.openweathermap.org';
var weatherApiKey = '&units=metric&appid=83394e100d62f245cc1222a6e67de282';

// DOM element references
var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#search-input');
var todayContainer = document.querySelector('#today');
var forecastContainer = document.querySelector('#forecast');
var searchHistoryContainer = document.querySelector('#history');

// Add timezone plugins to day.js
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

// Function to display the search history list.
function renderSearchHistory() {
  searchHistoryContainer.innerHTML = '';
  /*CLEAR SEARCHHISTORYCONTAINER*/


  // Start at end of history array and count down to show the most recent at the top.
  for (var i = searchHistory.length - 1; i >= 0; i--) {
    /*CREATE BTN*/
    var btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-controls', 'today forecast');
    btn.classList.add('history-btn', 'btn-history');

    // `data-search` allows access to city name when click handler is invoked
    btn.setAttribute('data-search', searchHistory[i]);
    btn.textContent = searchHistory[i];
    searchHistoryContainer.appendChild(btn);
  }
}
// renderSearchHistory();
// Function to update history in local storage then updates displayed history.
function appendToHistory(/*PARAM*/) {
  // If there is no search term return the function
  if (searchHistory.indexOf(/*PARAM*/) !== -1) {
    return;
  }
  searchHistory.push(/*PARAM*/);

  /*SET IN LOCALSTORAGE*/
  localStorage('search-history', JSON.stringify(searchHistory));
  renderSearchHistory();
}

// Function to get search history from local storage
function initSearchHistory() {
  var storedHistory = /*GET FROM LOCALSTORAGE*/storage.getItem(JSON.stringify('search-history'));
  if (storedHistory) {
    // Sets the global var of searchHistory to whatever localstorage had if any
    searchHistory = JSON.parse(storedHistory);
  }
  renderSearchHistory();
}

// Function to display the current weather data fetched from OpenWeather api.
function renderCurrentWeather(city, weather, timezone) {
  var date = dayjs().tz(timezone).format('M/D/YYYY');

  console.log(weather)
  // Store response data from our fetch request in variables
  var tempF = weather.current.main.temp
  var windMph = weather.current.wind.speed;
  var humidity = weather.current.main.humidity;
  var uvi = weather.current.visibility.value;
  var iconUrl = `https://openweathermap.org/img/w/${weather[0].current.icon/*API DATA*/}.png`;

  // Create the UI elements as variables
  var card = document.createElement("<div>");
  var cardBody =document.createElement("<div>") /*SOMETHING*/;
  var heading = document.createElement("<h3>");
  var weatherIcon = createElement('<div>'>)/*SOMETHING*/;
  var tempEl = createElement('<p>');
  var windEl = createElement('<p>');
  var humidityEl = createElement('<p>');
  var uvEl = createElement('<p>');
  var uviBadge = createElement('img');

  card.setAttribute('class', 'card');
  cardBody.setAttribute('class', 'card-body');
  card.appendChild(cardBody);

  heading.setAttribute('class', 'h3 card-title');
  tempEl.setAttribute('class', 'card-text');
  windEl.setAttribute('class', 'card-text');
  humidityEl.setAttribute('class', 'card-text');

  heading.textContent = City +',' + Date/*set text = City, Date*/;
  weatherIcon.setAttribute('src', iconUrl);
  weatherIcon.setAttribute('class', 'weather-img');
  heading.appendChild(weatherIcon)/*APPEND weatherIcon*/;
  tempEl.textContent = tempF + ' C'/*set text = tempF*/;
  windEl.textContent = windMph + ' KPH' /*set text = windMph*/;
  humidityEl.textContent = humidityEl + ' %'/*set text = humidity*/;
  cardBody.appendChild(card)/*APPEND heading, tempEl, windEl, humidityEl)*/;

  uvEl.textContent = 'UV Index: ';
  uviBadge.classList.add('btn', 'btn-sm');

  /* Uses a condition to check the UV levels*/
  if (uvi < 3) {
    uviBadge.classList.add('btn-success');
  } else if (uvi < 7) {
    uviBadge.classList.add('btn-warning');
  } else {
    uviBadge.classList.add('btn-danger');
  }

  uviBadge.textContent = uvi;
  uvEl.appendChild(uviBadge)/*APPEND uviBadge*/;
  cardBody.appendChild(uviEl)/*APPEND uviEl*/;

  todayContainer.innerHTML = ""/*SET BLANK*/;
  todayContainer.appendChild(card)/*APPEND card*/;
}

// Function to display a forecast card given an object from open weather api
// daily forecast.
function renderForecastCard(forecast, timezone) {
  // variables for data from api
  var unixTs = forecast.dt;
  var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
  var iconDescription = forecast.weather[0].description;
  var tempF = forecast.main.temp;
  var { humidity } = forecast.main.humidity/*TRAVERSE forecast to find out*/;
  var windMph = forecast.wind.speed/*TRAVERSE forecast to find out*/;

  // Create elements for a card
  var col = createElement('<div>')/*SOMETHING*/;
  var card = createElement('<div>')/*SOMETHING*/;
  var cardBody = createElement('<div>')/*SOMETHING*/;
  var cardTitle = createElement('<div>')/*SOMETHING*/;
  var weatherIcon = createElement('img') /*SOMETHING*/;
  var tempEl = createElement('<p>')/*SOMETHING*/;
  var windEl = createElement('<p>')/*SOMETHING*/;
  var humidityEl = createElement('<p>')/*SOMETHING*/;

  col.appendChild(card)/*APPEND CARD*/;
  card.appendChild(cardBody)/*APPEND CARDBODY*/
  cardBody.appendChild(card)/*APPEND cardTitle, weatherIcon, tempEl, windEl, humidityEl*/;

  col.setAttribute('class', 'col-md');
  col.classList.add('five-day-card');
  card.setAttribute('class', 'card bg-primary h-100 text-white');
  cardBody.setAttribute('class', 'card-body p-2');
  cardTitle.setAttribute('class', 'card-title');
  tempEl.setAttribute('class', 'card-text');
  windEl.setAttribute('class', 'card-text');
  humidityEl.setAttribute('class', 'card-text');

  // Add content to elements
  cardTitle.textContent = dayjs.unix(unixTs).tz(timezone).format('M/D/YYYY');
  weatherIcon.setAttribute('src', iconUrl);
  weatherIcon.setAttribute('alt', iconDescription);
  tempEl.textContent = tempF + ' C'/*set text = tempF*/;
  windEl.textContent = windMph + ' KPH' /*set text = windMph*/ ;
  humidityEl.textContent = { humidity } + ' %'/*set text = humidity*/ ;

  forecastContainer.appendChild(col)/*APPEND col*/;
}

// Function to display 5 day forecast.
function renderForecast(dailyForecast, timezone) {
  // Create unix timestamps for start and end of 5 day forecast
  var startDt = dayjs().tz(timezone).add(1, 'day').startOf('day').unix();
  var endDt = dayjs().tz(timezone).add(6, 'day').startOf('day').unix();

  // Create elements
  var headingCol = createElement ('<div>') /*SOMETHING*/;
  var heading = createElement ('<div>')/*SOMETHING*/;

  headingCol.setAttribute('class', 'col-12');
  heading.textContent = '5-Day Forecast:';
  headingCol.appendTo(heading)/*APPEND heading*/;

  forecastContainer.innerHTML = '';
  forecastContainer.appendTo(headingCol)/*APPEND headingCol*/;
  for (var i = 0; i < dailyForecast.length; i++) {
    // The api returns forecast data which may include 12pm on the same day and
    // always includes the next 7 days. The api documentation does not provide
    // information on the behavior for including the same day. Results may have
    // 7 or 8 items.
    if (dailyForecast[i].dt >= startDt && dailyForecast[i].dt < endDt) {
      renderForecastCard(dailyForecast[i], timezone);
    }
  }
}

function renderItems(city, data) {
  renderCurrentWeather(city, data.current, data.timezone);
  renderForecast(data.daily, data.timezone);
}

// Fetches weather data for given location from the Weather Geolocation
// endpoint; then, calls functions to display current and forecast weather data.
function fetchWeather(location) {
  var { lat } = location;
  var { lon } = location;
  var city = location.name;
  var apiUrl = `${weatherApiRootUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${weatherApiKey}`;

  
  /*FETCH APIURL*/
    /*.THEN() CONVERT THE RESPONSE FROM JSON*/
    fetch(apiUrl)
    .then(function (data) {
      renderItems(city, data);
    })
    .catch(function (err) {
      console.error(err);
    });
}

function fetchCoords(search) {
  var apiUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`;

  /*FETCH APIURL*/
    /*.THEN() CONVERT THE RESPONSE FROM JSON*/
    // .then(JSON.parse(apiUrl))
    fetch(apiUrl)
    .then(function (data) {
      if (!data[0]) {
        alert('Location not found');
      } else {
        appendToHistory(search);
        fetchWeather(data[0]);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
}

function handleSearchFormSubmit(e) {
  // Don't continue if there is nothing in the search form
  if (!searchInput.value) {
    return;
  }

  e.preventDefault();
  var search = searchInput.value.trim();
  fetchCoords(search);
  searchInput.value = '';
}

function handleSearchHistoryClick(e) {
  // Don't do search if current elements is not a search history button
  if (!e.target.matches('.btn-history')) {
    return;
  }

  var btn = e.target;
  var search = btn.getAttribute('data-search');
  fetchCoords(search);
}

initSearchHistory();
searchForm.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer.addEventListener('click', handleSearchHistoryClick);
