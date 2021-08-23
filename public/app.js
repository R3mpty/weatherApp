/* Project Description: Experiment with the OpenWeatherAPI and getting familiar with async javascript */

// Constants
const KEY = "39ddc44549dc237c67b83708c3258d23";
const KELVIN = 273;

// Element Selection:
const iconElement = document.querySelector('.weather-icon');
const tempElement = document.querySelector('.temperature-value p');
const descElement = document.querySelector('.temperature-description p');
const locationElement = document.querySelector('.location p');
const notificationElement = document.querySelector('.notification');
const inputElement = document.querySelector('.input');

// Object for the app's data
const weather = {
    unit:  "celsius",
    temperature: {}
}

// Check if browser supports
if ('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}
else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p> Browswer doesn't support Geolocation </p>"
}

function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);

}

function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${KEY}`;

    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            console.log(data)
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function(){
            displayWeather();
        })
}


function displayWeather(){
    iconElement.innerHTML = `<img src = "./icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}<span class="text-sm"> C <span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`
}

// celsius to fahrenheit
function cToF(temperature){
    return (temperature * 9/5) + 32;
}

// Event Listeners:
tempElement.addEventListener('click', function(){
    // in case the user doesn't allow for geo location or if the broswer doesn't support it
    if(weather.temperature.value === undefined) return;

    if(weather.temperature.unit == "celsius"){
        let fahrenheit = Math.floor(cToF(weather.temperature.value));
        tempElement.innerHTML = `${fahrenheit}<span class = "text-sm"> F <span>`;
        weather.temperature.unit = "fahrenheit";        
    }
    else{
        let celsius = weather.temperature.value;
        tempElement.innerHTML = `${celsius}<span class = "text-sm"> C <span>`;
        weather.temperature.unit = "celsius";  
    }
})

inputElement.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        alert('Enter is pressed!');
        setPosition(inputElement.value);
        inputElement.value = "";
    }
});

// getWeather(51.5074, 0.1278)
