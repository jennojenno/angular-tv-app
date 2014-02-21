app.controller("mainController", function($scope, $http){

    $scope.apiKey = "04f7780f3647f76e057ba9e64eb2c798";
    $scope.results = [];
    $scope.init = function() {
        //API requires a start date
        var today = new Date();

        //Now create the date string and ensure leading zeros if required
        var apiDate = today.getFullYear() + 
        ("0" + (today.getMonth() + 1)).slice(-2) + "" + 
        // getMonth will return 3 if month is April, so we must add 1 to it. Add the first 0,
        // then get just the last 2 digits in case the month is 12. 
        ("0" + today.getDate()).slice(-2);
        // same with the Date here, except we don't have to add 1. 

        $http.jsonp('http://api.trakt.tv/calendar/premieres.json/' + 
        // the $http.jsonp allows our app to call a URL we don't own to receive JSON data
        $scope.apiKey + '/' + apiDate + '/' + 30 + '/?callback=JSON_CALLBACK')
        // this API requires the api key, date, and number of days to work. 
        .success(function(data) {
            // here, data refers to all the returned Objects from the api.
            angular.forEach(data, function(value, index) {
                var date = value.date;
                angular.forEach(value.episodes, function(tvshow, index) {
                    tvshow.date = date;
                    $scope.results.push(tvshow);
                    //console.log(tvshow.episode.overview);
                });
            });
        }).error(function(error) {

        });
    };

});

// app.controller("mainController", function($scope, $http){
 
//     $scope.apiKey = "04f7780f3647f76e057ba9e64eb2c798";
//     $scope.init = function() {
//         //API requires a start date
//         var today = new Date();
//         //Create the date string and ensure leading zeros if required
//         var apiDate = today.getFullYear() + ("0" + (today.getMonth() + 1)).slice(-2) + "" + ("0" + today.getDate()).slice(-2);
//         $http.jsonp('http://api.trakt.tv/calendar/premieres.json/' + $scope.apiKey + '/' + apiDate + '/' + 30 + '/?callback=JSON_CALLBACK').success(function(data) {
//             results = data;
//             console.log(data);
//         }).error(function(error) {
//         });
//     };
 
// });