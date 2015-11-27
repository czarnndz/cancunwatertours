app.controller('Home', function($scope,$http, toursService) {
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

    $scope.getTours = function() {
      toursService.getTours().then(function(res){
        console.log(res);
        $scope.tours = $scope.formatTours(res);
      });
    };
    $scope.getToursRand = function(n) {
      $scope.loading = true;
      toursService.getTours().then(function(res){
        $scope.toursrand1 = $scope.formatToursRandom(res,3);
        $scope.toursrand2 = $scope.formatToursRandom(res,4);
        $scope.toursrand3 = $scope.formatToursRandom(res,4);
        $scope.loading = false;
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
                    avatar: tours[i].avatar,
                    fee : tours[i].fee,
                    url: tours[i].url,
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
                  avatar: tours[rand].avatar,
                  fee : tours[rand].fee,
                  url: tours[rand].url,
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

app.controller('Search',function($scope,$http, $window, toursService){

    $scope.querySearch = function(text) {
      return toursService.getToursByName(text)
        .then(function(data){
          console.log(data);
          return data;
        });
    };

    $scope.selectedItemChange = function(item){
      $window.location.href = '/tour/' + item.url;
    }

});
app.controller('StaticPagesCTL',function($scope,$http){
    //
});
