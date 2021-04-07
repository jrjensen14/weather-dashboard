var apiKey = "&appid=342afc766f128c80a1923123e36eb76d&units=imperial"

// Search for a City
// Presented with City Name, Date, Icon of weather conditions, Temp, Humidity, Wind Speed, UV index
// UV Index color indicates wheater the conditions are favorable, moderate, or severe
// 5 Day forcast: date, icon of weather condtions, temp, humidity
// click on a city in the search history: see current & future conditions

function getSearchValue() {
  var searchVal = document.querySelector("#search-value").value;
  searchWeather(searchVal);
  makeRow(searchVal);
}

function makeRow(searchVal) {
  var liEl = document.createElement("li")
  liEl.classList.add("list-group-item", "list-group-item-action");
  var text = searchVal;
  liEl.textContent = text;
  var historyEl = document.querySelector('.history');
  console.log(event.target)
  historyEl.onclick = function () {
    console.log(event.target.tagName)
    if (event.target.tagName == "LI") {
      searchWeather(event.target.textContent)
    }
  }
  historyEl.appendChild(liEl);
}

function searchWeather(searchVal) {
  fetch("http://api.openweathermap.org/data/2.5/weather?q=" + searchVal + apiKey)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      todayEl = document.querySelector("#today");
      todayEl.textContent = " ";

      var titleEl = document.createElement("h3")
      titleEl.classList.add("card-title");
      titleEl.textContent = data.name + " (" + new Date().toLocaleDateString() + ")";

      var cardEl = document.createElement("div")
      cardEl.classList.add("card");
      var windEl = document.createElement("p");
      windEl.classList.add("card-text");
      var humidityEl = document.createElement("p")
      humidityEl.classList.add("card-text");
      var tempEl = document.createElement("p")
      tempEl.classList.add("card-text");
      humidityEl.textContent = "Humidity: " + data.main.humidity + " %";
      tempEl.textContent = "Temp: " + data.main.temp + " F";

      var cardBodyEl = document.createElement("div")
      cardBodyEl.classList.add("card-body");
      var imgEl = document.createElement("img");
      // imgEl.setAttribute("src", "http://api.openweathermap.org/data/2.5/weather?q=" + data.weather[0].icon + ".png");

      titleEl.appendChild(imgEl)
      cardBodyEl.appendChild(titleEl);
      cardBodyEl.appendChild(tempEl);
      cardBodyEl.appendChild(humidityEl);
      cardBodyEl.appendChild(windEl);
      cardEl.appendChild(cardBodyEl);
      todayEl.appendChild(cardEl);

      getForecast(searchVal);
      getUVIndex(data.coord.lat, data.coord.lon);
    })
}

function getForecast(searchVal) {
  fetch("http://api.openweathermap.org/data/2.5/forecast?q=" + searchVal + apiKey)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data)
      var forecastEl = document.querySelector("#forecast");
      forecastEl.innerHTML = "<h4 class=\"mt-3\"> 5 Day Forecast:</h4>";
      forecastRowEl = document.createElement("div");
      forecastRowEl.className = "\"row\"";

      for (var i = 0; i < data.list.length; i++) {

        if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {

          var columnEl = document.createElement("div");
          columnEl.classList.add("col-md-2");
          var cardEl = document.createElement("div")
          cardEl.classList.add("card", "bg-primary", "text-white");

          var windEl = document.createElement("p");
          windEl.classList.add("card-text");
          windEl.textContent = "Wind Speed: " + data.list[i].wind.speed + "MPH";

          var humidityEl = document.createElement("p");
          humidityEl.classList.add("card-text");
          humidityEl.textContent = "Humidity: " + data.list[i].main.humidity + "%";

          var bodyEl = document.createElement("div");
          bodyEl.classList.add("card-body");

          var titleEl = document.createElement("h5");
          titleEl.classList.add("card-title");
          titleEl.textContent =  new Date(data.list[i].dt_txt).toLocaleDateString();

          var imgEl = document.createElement("img")
          imgEl.setAttribute("src", "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png")

          var p1El = document.createElement("p");
          p1El.classList.add("card-text");
          p1El.textContent = "Temperatue: " + data.list[i].main.temp_max + "F";

          var p2El = document.createElement("p");
          p2El.classList.add("card-text");
          p2El.textContent = "Humidity: " + data.list[i].main.humidity + "%";


          columnEl.appendChild(cardEl);
          bodyEl.appendChild(titleEl);
          bodyEl.appendChild(imgEl);
          bodyEl.appendChild(windEl);
          bodyEl.appendChild(humidityEl);
          bodyEl.appendChild(p1El);
          bodyEl.appendChild(p2El);
          cardEl.appendChild(bodyEl);
          forecastEl.appendChild(columnEl);
        }
      }
    });
}

function getUVIndex(lat, lon) {
  fetch("http://api.openweathermap.org/data/2.5/uvi?" + "lat=" + lat + "&lon=" + lon + apiKey)
  .then(function(response) {
    return response.json();
  }).then(function(data) {
    var bodyEl = document.querySelector(".card-body");
    var uvEl = document.querySelector("p");
    uvEl.textContent = "UV Index: "
    var buttonEl = document.createElement("span");
    buttonEl.classList.add("btn", "btn-sm");
    buttonEl.innerHTML = data.value;

    if (data.value < 3) {
      buttonEl.classList.add("btn-success");
    }
    else if (data.value < 7) {
      buttonEl.classList.add("btn-warning");
    } else {
      buttonEl.classList.add("btn-danger");
    }
     bodyEl.appendChild(uvEl);
     uvEl.appendChild(buttonEl); 
  })
}

document.querySelector("#search-button").addEventListener("click", getSearchValue);