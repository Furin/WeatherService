$(function() {

    // Parsed JSON object containing current condiditons
    var currentConditions;
 
changeAfterSelection = true;
 
    // Reference to weatherService form
    $weatherService = $('#weatherService');
 
// Reference to autoCompleteForm form
$autoCompleteForm = $('#autoCompleteForm');
    
    // Reference to results container
    $results = $("#results");
 
    // Set up submit event on weatherService form
    $weatherService.submit(function(){
        // reset result box to nothing
        $results.html('');        
        captureZipCode();
        return false;
    });
 
// Set up the auto complete field
locationAutoComplete();
 
// Set up submit event on autoCompleteForm
$autoCompleteForm.submit(function(){
$results.html('');
if (changeAfterSelection) {
selectFirstResult();
} else {
queryAutoComplete();
}
return false;
});
 
google.maps.event.addListener(autoComplete, 'place_changed', function() {
changeAfterSelection = false;
});
 
$('#locationSearch').change(function() {
changeAfterSelection = true;
});
});


/*
-------------------Functions----------------------
*/

// Function to query WeatherUnderground through proxy using the zipCode
var weatherDataZipCode = function(zipCode) {
    apiKey = "14aa95e36677fa2e";
    url = "http://weather-api.herokuapp.com/weather/" + apiKey + "/conditions/z/" + zipCode;
            
    $.ajax({
        url: url,
        success: function(data) {
            currentConditions = JSON.parse(data);
            console.log("Success");
            displayWeatherData();
        },
        error: function() {
            console.log("Error");
        }
    });
};
 
// Function to query WeatherUnderground through proxy using the Latitude and Longitude
var weatherDataLatLong = function(latitude, longitude) {
    apiKey = "14aa95e36677fa2e";
    url = "http://weather-api.herokuapp.com/weather/" + apiKey + "/conditions/g/" + latitude + "/" + longitude;
 
    $.ajax({
        url: url,
        success: function(data) {
            currentConditions = JSON.parse(data);
            displayWeatherData();
        },
        error: function() {
            console.log("Error");
        }
    });
};
        
// Function to capture ZIP code from text box on form
var captureZipCode = function(){
    // Reference to Zip Code Text Box
    $ZCTB = $("#zipCodeTextBox");
    // Make sure something was populated in the zip box
    if ($ZCTB.val()) {
        weatherDataZipCode($ZCTB.val());
    } else {
        $results.html("Please enter a value in the zip code box.");
    }
};
    
// Function to display the weather data
var displayWeatherData = function(){
    // if we receive an error from
if (currentConditions.current_observation) {
if (!currentConditions.response.error) {
$results.html(
"Temp: " + currentConditions.current_observation.temperature_string + "<br />" +
"Wind: " + currentConditions.current_observation.wind_string + " " + currentConditions.current_observation.wind_mph + " MPH (" + currentConditions.current_observation.wind_kph + " KPH) <br />"
);
} else {
$results.html(currentConditions.response.error.description);
}
} else {
$results.html("Weather information could not be found for this location.");
}
};
 
// Function that sets up the auto complete 
var locationAutoComplete = function () {
var locationInput = document.getElementById('locationSearch');
var options = {
types: ['(cities)']
};
 
autoComplete = new google.maps.places.Autocomplete(locationInput, options);
}; 
 
// Function query autocomplete data
var queryAutoComplete = function() {
 
var place = autoComplete.getPlace();
 
if(place.geometry){
weatherDataLatLong(place.geometry.location.lat(), place.geometry.location.lng());
} else {
$results.html("Or Please select an option from the auto complete suggestions");
}
};
 
function selectFirstResult() {
$(".pac-container").hide();
var firstResult = $(".pac-container .pac-item:first").text();
 
var geocoder = new google.maps.Geocoder();
geocoder.geocode({"address":firstResult }, function(results, status) {
if (status == google.maps.GeocoderStatus.OK) {
var lat = results[0].geometry.location.lat(),
lng = results[0].geometry.location.lng();
weatherDataLatLong(lat, lng);
}
});   
 }