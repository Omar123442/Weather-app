let cityinput = document.getElementById("input"); 
let searchbtn = document.getElementById("btn-search"); 
let API_KEY = "3994ee6bd140f249d17412da3d033d7d"; 
let weathercards = document.getElementById("weathercard"); 

async function displayweatherdata(event) {
    event.preventDefault();
    let city = cityinput.value.trim();
    fetchWeatherDataByCity(city);
}

async function fetchWeatherDataByCity(city) {
    let API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    let response = await fetch(API_URL);
    let data = await response.json();
    console.log(data);

    document.getElementById("citys").innerHTML = data.name;
    document.querySelector(".ff").innerHTML = `${data.main.temp}°C`;
    document.querySelector(".weather-app img").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    let lat = data.coord.lat;
    let lon = data.coord.lon;
    fetchForecastData(lat, lon);
}

async function fetchForecastData(lat, lon) {
    let API_FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    let response = await fetch(API_FORECAST_URL);
    let data = await response.json();
    console.log(data);

    let forecastsByDate = {};
    data.list.forEach(forecast => {
        let date = forecast.dt_txt.split(" ")[0];
        if (!forecastsByDate[date]) {
            forecastsByDate[date] = [];
        }
        forecastsByDate[date].push(forecast);
    });

    let fiveDaysForecast = Object.keys(forecastsByDate).slice(0, 5).map(date => {
        let dailyForecasts = forecastsByDate[date];
        let temp_max = Math.max(...dailyForecasts.map(f => f.main.temp_max));
        let temp_min = Math.min(...dailyForecasts.map(f => f.main.temp_min));
        return {
            date,
            temp_max,
            temp_min,
            humidity: dailyForecasts[0].main.humidity,  
            wind_speed: dailyForecasts[0].wind.speed,   
            weather: dailyForecasts[0].weather[0]       
        };
    });

    console.log(fiveDaysForecast);
    weathercards.innerHTML = ""; 
    fiveDaysForecast.forEach(item => {
        weathercards.insertAdjacentHTML("beforeend", weathercard(item)); 
    });
}

function weathercard(weatherItem) {
    return `
    <div class="col mt-2">
        <div class="pt-4 daily">
            <p class="" style="display: inline-block;">${weatherItem.date}</p>
            <div class="mb-4">
                <img class="ee" src="https://openweathermap.org/img/wn/${weatherItem.weather.icon}@2x.png" alt="">
            </div>
            <p style="display: inline-block; vertical-align: middle;">${weatherItem.humidity}%</p>
            <div>
                <i class="fa-solid fa-droplet"></i>
            </div>
            <span>&#92;</span> 
            <p style="display: inline-block;">${weatherItem.wind_speed} m/s</p>
            <div>
                <i class="fa-solid fa-wind"></i>
            </div>
            <span>&#92;</span> 
            <p style="display: inline-block;">${weatherItem.temp_max}°C</p>
            <p>${weatherItem.temp_min}°C</p>
        </div> 
    </div>
    `;
}

searchbtn.addEventListener("click", displayweatherdata);

async function fetchWeatherDataByCoords(lat, lon) {
    let API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    let response = await fetch(API_URL);
    let data = await response.json();
    console.log(data);

    document.getElementById("citys").innerHTML = data.name;
    document.querySelector(".ff").innerHTML = `${data.main.temp}°C`;
    document.querySelector(".weather-app img").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    fetchForecastData(lat, lon);
}


function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            fetchWeatherDataByCoords(lat, lon);
        }, error => {
            console.error("Error getting user's location:", error);

            fetchWeatherDataByCity("London");
        });
    } else {
        console.error("Geolocation is not supported by this browser.");

        fetchWeatherDataByCity("London");
    }
}


window.onload = getUserLocation;
