app.controller("mainController", function($scope, $http){

    $scope.apiKey = "04f7780f3647f76e057ba9e64eb2c798";
    $scope.init = function() {
        //API requires a start date
        var today = new Date();

        //Now create the date string and ensure leading zeros if required
        var apiDate = today.getFullYear() + 
        ("0" + (today.getMonth() + 1)).slice(-2) + "" + 
        ("0" + today.getDate()).slice(-2);

        $http.jsonp('http://api.trakt.tv/calendar/premiers.json/' + $scope.apiKey + '/' + apiDate + '/' + 30 + '/?callback=JSON_CALLBACK').success(function(data) {
            console.log(data);
        }).error(function(error) {

        });
    };

});