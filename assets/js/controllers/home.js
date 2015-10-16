
app.controller('Home', function($scope,$http) {
    $scope.tours = [];
    $scope.hotels = [];
    $scope.agregarVisibility = false;
    $scope.lengthsArray = [
        { col : 2 ,row : 1 },
        { col : 2 ,row : 1 },
        { col : 2 ,row : 1 },
        { col : 2 ,row : 1 },
        { col : 4 ,row : 3 },
        { col : 2 ,row : 3 },
        { col : 2 ,row : 3 },
    ];

    $http.get('/tours').success(function(response) {
        console.log("responseeee");
        console.log(response);
        if (angular.isArray(response)) {

            $scope.tours = (function() {
                var aux_tours = [];
                var span = 1;
                for (var i = 0; i < 7; i++) {
                    //colspan = randomSpan();
                    //rowspan = randomSpan(colspan);
                    aux_tours.push({
                        id : response[i].id,
                        name: response[i].name,
                        icon : response[i].avatar3,
                        fee : response[i].fee,
                        colspan: $scope.lengthsArray[i].col,
                        rowspan: $scope.lengthsArray[i].row
                    });
                }
                console.log(aux_tours);
                return aux_tours;

            })();
        }

    });

    $http.get('/hotels').success(function(response) {
        $scope.hotels = response;
    });



    function randomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function randomSpan(use_max) {
        var r = Math.random();
        if (r < 0.8 || use_max == 1) {
            return 1;
        } else if (r < 0.9 || use_max == 2) {
            return 2;
        //} else {
        //    return 3;
        }
    }

    $scope.selectTour = function(tour) {
        $scope.agregarVisibility = true;
        $scope.selectedTour = tour;
    }
});

app.controller('Search',function($scope,$http){
    $scope.tours = [];

    $http.get('/tours').success(function(response) {
        if (angular.isArray(response)) {
            $scope.tours = response;
        }
    });
});

app.controller('Resultados', function($scope,$http) {

});

app.controller('Header', function($scope,$http, toursService) {
    $scope.tours = [];
    $scope.maxFee = 0;
    $scope.minFee = 10000;
    $scope.toursCategories = [];

    $http.get('/tours').success(function(response) {
        if (angular.isArray(response)) {
            $scope.tours = response;

            angular.forEach($scope.tours,function(item) {
                if (item.fee > $scope.maxFee) {
                    $scope.maxFee = item.fee;
                }
                if (item.fee < $scope.minFee) {
                    $scope.minFee = item.fee
                }
            });
        }
    });

    $scope.getToursCategories = function() {
      toursService.getCategories().then(function(res){
        $scope.toursCategories = res;
        console.log($scope.toursCategories);
      });
    };

    $scope.querySearch = function(text) {
        var tours = [];
        if (angular.isArray($scope.tours)) {
            angular.forEach($scope.tours,function(item) {
                if (item.name.contains(text));
                    this.push(item);
            },tours);

        }
        return tours;
    }

    $scope.getToursCategories();


});
