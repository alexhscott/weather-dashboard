var key = "6d0b39c8aaba44b1d95d7aa29390a53f";
var city;

// Get current date & time
var date = moment().format("dddd, MMMM Do YYYY");
var currentTime = moment().format("YYYY-MM-DD HH:MM:SS");

var savedCity = [];
// Save previously searched cities
$(".search").on("click", function (event) {
  event.preventDefault();
  city = $(this).parent(".btnPar").siblings(".textVal").val().trim();
  if (city === "") {
    return;
  }
  savedCity.push(city);

  localStorage.setItem("city", JSON.stringify(savedCity));
  fiveDayForecast.empty();
  getHistory();
  weatherToday();
});

// Makes saved search history into buttons
var savedCityBtn = $(".savedCity");
function getHistory() {
  savedCityBtn.empty();

  for (let i = 0; i < savedCity.length; i++) {
    var rowEl = $("<row>");
    var btnEl = $("<button>").text(`${savedCity[i]}`);

    rowEl.addClass("row cityBtnRow");
    btnEl.addClass("btn btn-outline-secondary Btn");
    btnEl.attr("type", "button");

    savedCityBtn.prepend(rowEl);
    rowEl.append(btnEl);
  }
  if (!city) {
    return;
  }

  // Turns buttons into search on click
  $(".savedCity").on("click", function (event) {
    event.preventDefault();
    city = $(this).text();
    fiveDayForecast.empty();
    weatherToday();
  });
}

// Current Day's Card
var currentDayCard = $(".cardBodyToday");

// Displays the current day's weather forecast
function weatherToday() {
  var currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;

  $(currentDayCard).empty();

  $.ajax({
    url: currentWeather,
    method: "GET",
  }).then(function (response) {
    $(".cardTodayCityName").text(response.name);
    $(".cardTodayDate").text(date);
    // Icon
    $(".icons").attr(
      "src",
      `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`
    );
    // Temperature
    var temp = $("<p>").text(`Temperature: ${response.main.temp} °F`);
    currentDayCard.append(temp);
    // Feels Like
    var feelsLike = $("<p>").text(`Feels Like: ${response.main.feels_like} °F`);
    currentDayCard.append(feelsLike);
    // Humidity
    var humidity = $("<p>").text(`Humidity: ${response.main.humidity} %`);
    currentDayCard.append(humidity);
    // Wind Speed
    var wind = $("<p>").text(`Wind Speed: ${response.wind.speed} MPH`);
    currentDayCard.append(wind);
    //Set the lat and long from the searched city
    var cityLongitude = response.coord.lon;
    // console.log(cityLongitude);
    var cityLatitude = response.coord.lat;
    // console.log(cityLatitude);

    var uviUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLatitude}&lon=${cityLongitude}&exclude=hourly,daily,minutely&appid=${key}`;

    $.ajax({
      url: uviUrl,
      method: "GET",
    }).then(function (response) {
      var uviEl = $("<p>").text(`UV Index: `);
      var uviSpan = $("<span>").text(response.current.uvi);
      var uvi = response.current.uvi;
      uviEl.append(uviSpan);
      currentDayCard.append(uviEl);
      // severity of UV Index
      if (uvi >= 0 && uvi <= 2) {
        uviSpan.attr("class", "green");
      } else if (uvi > 2 && uvi <= 5) {
        uviSpan.attr("class", "yellow");
      } else if (uvi > 5 && uvi <= 7) {
        uviSpan.attr("class", "orange");
      } else if (uvi > 7 && uvi <= 10) {
        uviSpan.attr("class", "red");
      } else {
        uviSpan.attr("class", "purple");
      }
    });
  });
  getFiveDayForecast();
}

// Five Day Forecast Card
var fiveDayForecast = $(".fiveForecast");

// Displays Five Day Forecast
function getFiveDayForecast() {
  var fiveDayUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`;

  $.ajax({
    url: fiveDayUrl,
    method: "GET",
  }).then(function (response) {
    var fiveDayArray = response.list;
    var myWeather = [];
    // Made a object that would allow for easier data read
    $.each(fiveDayArray, function (index, value) {
      testObj = {
        date: value.dt_txt.split(" ")[0],
        time: value.dt_txt.split(" ")[1],
        temp: value.main.temp,
        feels_like: value.main.feels_like,
        icon: value.weather[0].icon,
        humidity: value.main.humidity,
      };

      if (value.dt_txt.split(" ")[1] === "12:00:00") {
        myWeather.push(testObj);
      }
    });
    // Display cards
    for (let i = 0; i < myWeather.length; i++) {
      var fiveDayCard = $("<div>");
      fiveDayCard.attr("class", "card text-white bg-primary mb-3 cardOne");
      fiveDayCard.attr("style", "max-width: 200px;");
      fiveDayForecast.append(fiveDayCard);

      var fiveDayHeader = $("<div>");
      fiveDayHeader.attr("class", "card-header");
      var fiveDayDateTime = moment(`${myWeather[i].date}`).format("MM-DD-YYYY");
      fiveDayHeader.text(fiveDayDateTime);
      fiveDayCard.append(fiveDayHeader);

      var fiveDayBody = $("<div>");
      fiveDayBody.attr("class", "card-body");
      fiveDayCard.append(fiveDayBody);

      var fiveDayIcon = $("<img>");
      fiveDayIcon.attr("class", "icons");
      fiveDayIcon.attr(
        "src",
        `https://openweathermap.org/img/wn/${myWeather[i].icon}@2x.png`
      );
      fiveDayBody.append(fiveDayIcon);

      // Displays the following on each card
      //Temp
      var temp = $("<p>").text(`Temperature: ${myWeather[i].temp} °F`);
      fiveDayBody.append(temp);
      //Feels Like
      var feelsLike = $("<p>").text(
        `Feels Like: ${myWeather[i].feels_like} °F`
      );
      fiveDayBody.append(feelsLike);
      //Humidity
      var humidity = $("<p>").text(`Humidity: ${myWeather[i].humidity} %`);
      fiveDayBody.append(humidity);
    }
  });
}

initLoad();
