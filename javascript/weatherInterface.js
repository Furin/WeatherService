// Last updated by Damian Orlikowski on 4/16/2013

$(function() {

    // Parsed JSON object containing current condiditons
    var currentConditions;

    // Reference to form
    $weatherService = $('#weatherService');

    // Setup form event on submit button
    $weatherService.submit(function(){
        captureZipCode();
        return false;
    });
      
    // Function to query WeatherUnderground through proxy using the zipCode
    var weatherData = function(zipCode) {
        apiKey = "14aa95e36677fa2e";
        url = "http://weather-api.herokuapp.com/weather/" + apiKey + "/conditions/z/" + zipCode;
            
        $.ajax({
            url: url,
            success: function(data) {
                var currentConditions = JSON.parse(data);
                console.log("Success");
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
        weatherData($ZCTB.val());
    };
    
});