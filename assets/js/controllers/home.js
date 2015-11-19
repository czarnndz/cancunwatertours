
app.controller('Home', function($scope,$http, toursService, searchService) {
    $scope.tours = [];
    $scope.hotels = [];
    $scope.agregarVisibility = false;
    $scope.lengthsArray = [
        { col : 4 ,row : 2 },
        { col : 2 ,row : 1 },
        { col : 2 ,row : 2 },
        { col : 2 ,row : 1 },
        { col : 4 ,row : 2 },
        { col : 2 ,row : 1 },
        { col : 2 ,row : 1 },
    ];


    $scope.getTours = function() {
      toursService.getTours().then(function(res){
        console.log(res);
        $scope.tours = $scope.formatTours(res);
      });
    };

    $scope.formatTours = function(tours){
        return (function() {
            var aux_tours = [];
            var span = 1;
            for (var i = 0; i < 7; i++) {
                //colspan = randomSpan();
                //rowspan = randomSpan(colspan);
                aux_tours.push({
                    id : tours[i].id,
                    name: tours[i].name,
                    icon : tours[i].avatar3,
                    fee : tours[i].fee,
                    colspan: $scope.lengthsArray[i].col,
                    rowspan: $scope.lengthsArray[i].row
                });
            }
            return aux_tours;
        })();
    };

    $scope.getHotels = function(){
        $http.get('/hotels').success(function(response) {
            //console.log(response);
            $scope.hotels = response;
        });
    };

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
    };

    $scope.init = function(){
        $scope.getHotels();
        $scope.getTours();
    };

    $scope.init();
});

app.controller('Search',function($scope,$http){
    $scope.tours = [];

    $http.get('/tours').success(function(response) {
        if (angular.isArray(response)) {
            $scope.tours = response;
        }
    });
});
app.controller('StaticPagesCTL',function($scope,$http){
    //
});