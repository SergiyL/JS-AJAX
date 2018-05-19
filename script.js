
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(displayData);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function displayData(position) {
    $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+ 
        position.coords.latitude + "," + position.coords.longitude + 
        "&sensor-false", (data) => {
            $('h2').html(data.results[2].address_components[0].long_name 
                + ", " + data.results[2].address_components[2].long_name);
    })

    $.ajax({
        url: "https://api.darksky.net/forecast/1223906413883fd97fb6e7bd83be3421/" + 
        position.coords.latitude + "," + position.coords.longitude + "," + currentDay,
        dataType: "jsonp",
        success: function( response ) {
            let temperatureLow = response.daily.data[0].temperatureLow;
            let temperatureHigh = response.daily.data[0].temperatureHigh;
            $(".minTemp").html("мін. " + convertToCelcius(temperatureLow) + "°C");
            $(".maxTemp").html("макс. " + convertToCelcius(temperatureHigh) + "°C"); 
        }
    })
    
    let today = parseInt((currentData - currentData % 86400000).toString().slice(0,10)) - 10800;
    $.ajax({
        url: "https://api.darksky.net/forecast/1223906413883fd97fb6e7bd83be3421/" + 
        position.coords.latitude + "," + position.coords.longitude + "," + today,
        dataType: "jsonp",
        success: function( response ) {
            let temperature = response.currently.temperature;
            let pressure = response.currently.pressure;
            $('.today').html("Сьогодні " + new Date().getDate() + " " + month() + 
            " " + convertToCelcius(temperature) + "°C, атмосферний тиск " + convertToMilimetrs(pressure) + " мм");
        }
    })
    $('.currentDay').html("прогноз погоди на " + new Date(time).getDate());
    $('.currentMonth').html(month());
}

function convertToCelcius (farengheit) {
    let degree = ((farengheit - 32) * 5/9).toFixed(1);
    let sign = (degree === 32)? "" : (degree > 32)? "-" : "+";
    return  sign + degree;
}

function convertToMilimetrs(paskal) {
    let mm = 0.75 * paskal;
    return mm.toFixed(0);
}

let currentData = new Date().getTime();
let currentDay = parseInt((currentData - currentData % 86400000).toString().slice(0,10)) - 10800;
let time = new Date().getTime();

function month() {
    let month = "";
    switch(new Date(time).getMonth()) {
        case 0:
            month = "січня";
            break;
        case 1:
            month = "лютого";
            break;                
        case 2:
            month = "березня";
            break;
        case 3:
            month = "квітня";
            break;
        case 4:
            month = "травня";
            break;
        case 5:
            month = "червня";
            break;
        case 6:
            month = "липня";
            break;
        case 7:
            month = "серпня";
            break;
        case 8:
            month = "вересня";
            break;
        case 9:
            month = "жовтня";
            break;
        case 10:
            month = "листопада";
            break
        case 11:
            month = "грудня";
            break;
    }
    return month;
}

document.querySelector(".back").addEventListener('click', () => {
    currentDay -= 86400;
    time -= 86400000; 
    getLocation();
});

document.querySelector(".forward").addEventListener('click', () => {
    currentDay += 86400;
    time += 86400000;
    getLocation();
});