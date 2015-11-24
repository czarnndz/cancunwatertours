
app.controller('Home', function($scope,$http, toursService, searchService) {
    $scope.tours = [];
    $scope.hotels = [];
    $scope.agregarVisibility = false;
    $scope.lengthsArray = [
        { collg : 4, rowlg : 2 ,colmd : 2 ,rowmd : 1},
        { collg : 2, rowlg : 1 ,colmd : 1 ,rowmd : 1},
        { collg : 2, rowlg : 2 ,colmd : 1 ,rowmd : 1},
        { collg : 2, rowlg : 1 ,colmd : 2 ,rowmd : 1},
        { collg : 4, rowlg : 2 ,colmd : 2 ,rowmd : 1},
        { collg : 2, rowlg : 1 ,colmd : 1 ,rowmd : 1},
        { collg : 2, rowlg : 2 ,colmd : 1 ,rowmd : 1}
    ];
    $scope.randArray = [];

    $scope.getTours = function() {
      toursService.getTours().then(function(res){
        $scope.tours = $scope.formatTours(res);
      });
    };
    $scope.getToursRand = function(n) {
      toursService.getTours().then(function(res){
        $scope.toursrand1 = $scope.formatToursRandom(res,3);
        $scope.toursrand2 = $scope.formatToursRandom(res,4);
        $scope.toursrand3 = $scope.formatToursRandom(res,4);
      });
    };

    $scope.formatTours = function(tours){
        return (function() {
            var aux_tours = [];
            var span = 1;
            for (var i = 0; i < 4; i++) {
                //colspan = randomSpan();
                //rowspan = randomSpan(colspan);
                aux_tours.push({
                    id : tours[i].id,
                    name: tours[i].name,
                    icon : tours[i].avatar3,
                    fee : tours[i].fee,
                    collgspan: $scope.lengthsArray[i].collg,
                    rowlgspan: $scope.lengthsArray[i].rowlg,
                    colmdspan: $scope.lengthsArray[i].colmd,
                    rowmdspan: $scope.lengthsArray[i].rowmd
                });
            }
            return aux_tours;
        })();
    };
    $scope.formatToursRandom = function(tours,n){
        return (function() {
            var aux_tours = [];
            var span = 1;
            var rand = Math.floor( Math.random() * tours.length );
            for (var i = 0; i < n; i++) {
              while( $.inArray( rand,$scope.randArray ) != -1 ){
                rand = Math.floor( Math.random() * tours.length );
              }
              $scope.randArray.push( rand );
              aux_tours.push({
                  id : tours[rand].id,
                  name: tours[rand].name,
                  icon : tours[rand].avatar3,
                  fee : tours[rand].fee,
                  collgspan: $scope.lengthsArray[i].collg,
                  rowlgspan: $scope.lengthsArray[i].rowlg,
                  colmdspan: $scope.lengthsArray[i].colmd,
                  rowmdspan: $scope.lengthsArray[i].rowmd
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
        $scope.getToursRand();
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

app.controller('Header', function($scope,$http, $rootScope, toursService, searchService) {
    $scope.tours = [];
    $scope.maxFee = 0;
    $scope.minFee = 10000;
    $scope.toursCategories = [];
    $scope.registerToggle = false;
    $scope.loginToggle = false;

    $scope.doLoginToggle = function(){
      if($scope.registerToggle){
        $scope.registerToggle = false;
      }
      $scope.loginToggle = !$scope.loginToggle;
    };

    $scope.doRegisterToggle = function(){
      if($scope.loginToggle){
        $scope.loginToggle = false;
      }
      $scope.registerToggle = !$scope.registerToggle;
    };

    $scope.getFeeRange = function(){
        toursService.getFeeRange().then(function(res){
            $scope.minFee = res.minFee;
            $scope.maxFee = res.maxFee;
        });
    };

    $scope.getToursCategories = function() {
      toursService.getCategories().then(function(res){
        $scope.toursCategories = res;
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

    $scope.init = function(){
        $scope.getToursCategories();
        $scope.getFeeRange();
    };

    $scope.init();


});
