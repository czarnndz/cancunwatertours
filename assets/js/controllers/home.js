
app.controller('Home', function($scope,$http, searchService) {
    $scope.tours = [];
    $scope.hotels = [];
    $scope.agregarVisibility = false;

    $http.get('/tours').success(function(response) {
        if (angular.isArray(response)) {

            $scope.tours = (function() {
                var aux_tours = [];
                var span = 1;
                for (var i = 0; i < response.length; i++) {
                    colspan = randomSpan();
                    rowspan = randomSpan(colspan);
                    aux_tours.push({
                        id : response[i].id,
                        name: response[i].name,
                        icon : response[i]['avatar' + (colspan)],
                        fee : response[i].fee,
                        colspan: colspan,
                        rowspan: rowspan
                    });
                }
                return aux_tours;
            })();
        }

    });

    $http.get('/hotels').success(function(response) {
        //console.log(response);
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
        console.log(tour);
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

app.controller('Header', function($scope,$http, $rootScope, toursService, searchService) {
    $scope.tours = [];
    $scope.maxFee = 0;
    $scope.minFee = 10000;
    $scope.toursCategories = [];

    $rootScope.$on('searchParamsChanged', function(event,data){
      console.log(data);
    });

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
    };

    $scope.doSearch = function(){
      var params = {
        minFee: $scope.minFee,
        maxFee: $scope.maxFee,
        category: $scope.tourCategory
      };
      searchService.setParams(params);
    };

    $scope.getToursCategories();


});
