app.controller('Home',['$scope','$http','$rootScope', 'toursService','cartService', function($scope,$http,$rootScope, toursService,cartService) {
    $scope.tours = [];
    $scope.hotels = [];
    $scope.loading = false;
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

    $scope.getLandingTours = function(res){
        $scope.loading = true;
        var fixedIds = [
            '570fd560bc3f9a0c00950470', //Tour en la jungla
            '568ee28a1e8b6c0c0060d9ed', //Pesca privada 31 pies
            '568ed0f9abb4d00c005ec824', //Pesca compartida
            '5695378c08b0320c0044b32e', //Bungee extremo
            '569542c308b0320c0044b33f'
        ];

        toursService.getToursById(fixedIds).then(function(fixedTours){
            toursService.getTours().then(function(tours){
                $scope.loading = false;
                var group1 = fixedTours.slice(0,1);
                var group2 = fixedTours.slice(1,5);
                $scope.toursrand1 = $scope.formatTours( group1 );
                $scope.toursrand2 = $scope.formatTours( group2 );
                $scope.toursrand3 = $scope.formatToursRandom( tours, 4 );
                $scope.updatePrices();
            });

        });
    }

    $scope.formatTours = function(tours){
        return (function() {
            var aux_tours = [];
            for (var i = 0; i < tours.length; i++) {
                //colspan = randomSpan();
                //rowspan = randomSpan(colspan);
                var tourMainCategories = toursService.getMainCategories(tours[i].categories);
                aux_tours.push({
                    id : tours[i].id,
                    name: tours[i].name,
                    name_en: tours[i].name_en,
                    icon : tours[i].avatar3,
                    avatar: tours[i].avatar,
                    fee : tours[i].fee,
                    feeChild : tours[i].feeChild,
                    url: tours[i].url,
                    haveTransfer : tours[i].haveTransfer,
                    hotel : false,
                    adults : 1,
                    kids : 0,
                    firstCategory: tourMainCategories[0] || {},
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
              var tourMainCategories = toursService.getMainCategories(tours[rand].categories);
              aux_tours.push({
                  id : tours[rand].id,
                  name: tours[rand].name,
                  name_en: tours[rand].name_en,
                  icon : tours[rand].avatar3,
                  avatar: tours[rand].avatar,
                  fee : tours[rand].fee,
                  feeChild : tours[i].feeChild,
                  url: tours[rand].url,
                  haveTransfer : tours[rand].haveTransfer,
                  hotel : false,
                  adults : 1,
                  kids : 0,
                  firstCategory: tourMainCategories[0] || {},
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
        //$scope.getTours();
        $scope.getLandingTours();
    };

    $scope.getCategoryIcon = function(category){
      return toursService.getCategoryIcon(category);
    };

    $scope.updatePrices = function(){
        var functions = [];
        functions.push(
            function(cb) {
                async.each($scope.tours,
                    function(tour,callback){
                        cartService.getPriceTour(tour,function(val){
                        tour.total_price = val;
                        callback();
                    })},function(e){
                        cb(e,true);
                    });
            }
        );
        functions.push(
            function(cb) {
                async.each($scope.toursrand1,
                    function(tour,callback){
                        cartService.getPriceTour(tour,function(val){
                            tour.total_price = val;
                            callback();
                        })},function(e){
                        cb(e,true);
                    });
            }
        );
        functions.push(
            function(cb) {
                async.each($scope.toursrand2,
                    function(tour,callback){
                        cartService.getPriceTour(tour,function(val){
                            tour.total_price = val;
                            callback();
                        })},function(e){
                        cb(e,true);
                    });
            }
        );
        functions.push(
            function(cb) {
                async.each($scope.toursrand3,
                    function(tour,callback){
                        cartService.getPriceTour(tour,function(val){
                            tour.total_price = val;
                            callback();
                        })},function(e){
                        cb(e,true);
                    });
            }
        );
        async.parallel(functions,function(err,res) {
            console.log(res);
        });
    };

    $scope.$on('CURRENCY_CHANGE', function () {
        $scope.updatePrices();
    });

    $scope.init();
}]);

app.controller('Search',['$scope', '$window', 'toursService','$rootScope','localStorageService', function($scope, $window, toursService,$rootScope,localStorageService){
    $scope.querySearch = function(text) {
      return toursService.getToursByName(text)
        .then(function(data){
          console.log(data);
          return data;
        });
    };

    $scope.selectedItemChange = function(item){
      $window.location.href = '/' +  $rootScope.currentLang +  '/tour/' + item.url;
    }
}]);
/*
app.controller('StaticPagesCTL',['$scope,$http' ,function($scope,$http){
    //
}]);
*/
