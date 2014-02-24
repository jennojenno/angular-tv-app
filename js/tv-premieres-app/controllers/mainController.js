app.controller("mainController", function($scope, $http){

    $scope.apiKey = "04f7780f3647f76e057ba9e64eb2c798";
    $scope.results = [];
    $scope.filterText = null; // Set this to null so that, at first, it has no filter
    $scope.availableGenres = [];
    $scope.genreFilter = null; 

    $scope.orderFields = ["Air Date", "Rating"];
    $scope.orderDirections = ["Descending", "Ascending"];
    $scope.orderField = "Air Date"; // default
    $scope.orderReverse = false;
    
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
        // it is an Angular thing and generates an HTTP request. It returns with either
        // a success or error, always. 
        $scope.apiKey + '/' + apiDate + '/' + 30 + '/?callback=JSON_CALLBACK')
        // this API requires the api key, date, and number of days to work. 
        // doc: http://trakt.tv/api-docs/calendar-premieres
        .success(function(data) {
            // here, data refers to all the returned Objects from the api.
            angular.forEach(data, function(value, index) {
                // Saving the date below bc this api stores the date separately 
                var date = value.date;
                // Now we are saving each episode and inserting it into results array
                angular.forEach(value.episodes, function(tvshow, index) {
                    tvshow.date = date; // Attach date to each episode
                    $scope.results.push(tvshow);
                    //console.log(tvshow.episode.overview);

                    angular.forEach(tvshow.show.genres, function(genre, index){
                        var exists = false;
                        angular.forEach($scope.availableGenres, function(avGenre, index){
                            if (avGenre == genre) {
                                exists = true;
                            }
                        });
                        if (exists == false && genre != ""){
                            $scope.availableGenres.push(genre);
                        }
                    }) 
                });
            });
        // console.log($scope.availableGenres);
        }).error(function(error) {

        });
    };

    $scope.setGenreFilter = function(genre) {
        $scope.genreFilter = genre;
    }

    $scope.customOrder = function(tvshow){
        switch ($scope.orderField) {
        case "Air Date": 
            return tvshow.episode.first_aired;
            break;
        case "Rating":
            return tvshow.episode.ratings.percentage;
            break;
        }
    };
});

app.filter('matchGenre', function() {
    //Input here refers to all the returned objects, all the TV shows retrieved
    return function(input, genre) {
        if (typeof genre == 'undefined' || genre == null) {
            return input; 
        } else { 
            var out = [];
            console.log(input);
            for (var a = 0; a < input.length; a++){
                for (var b = 0; b < input[a].show.genres.length; b++) {
                    if(input[a].show.genres[b] == genre) {
                        out.push(input[a]); 
                    }
                }
            }
            return out;
        }
    }
});