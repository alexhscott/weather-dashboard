var searchInput = document.getElementById('search-city');
var searchBtn = document.getElementById('search-btn');
var city;
var currentForcast = document.getElementById('current-forcast');

var apiKey = '6d0b39c8aaba44b1d95d7aa29390a53f'


// funciton to get city
function getCity(event){
    event.preventDefault()
    var searchCity = searchInput.value
    console.log(searchCity);

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchCity}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => getWeather(data));
}

// get weather
function getWeather(cityData){
    console.log(cityData);
    city = cityData[0].name;
    var lat = cityData[0].lat;
    var lon = cityData[0].lon;
   
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => renderWeather(data));
}

// render weather
function renderWeather(forcast){
    console.log(forcast)
    var date = forcast.current.dt;
    date = new Date(date * 1000)
    date = date.toLocaleString()
    date = date.split(",")
    date = date[0];
    var temp = forcast.current.temp;
    temp = ((temp - 273.5) * 1.8) + 32;
    temp = Math.round(temp)
    var wind = forcast.current.wind_speed;
    var humidity = forcast.current.humidity;
    var uvIndex = forcast.current.uvi;
    console.log(date, temp, wind, humidity, uvIndex);
    // create template for variables
    var template = `
        <h2>${city} - ${date}</h2>
        <p>Temp: ${temp}°F</p>
        <p>Wind: ${wind} MPH</p>
        <p>Humidity: ${humidity} %</p>
        <UV Index: ${uvIndex}</p>
    `
    // render template with inner html method
    currentForcast.innerHTML = template
}




searchBtn.addEventListener('click', getCity);