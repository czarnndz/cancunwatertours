

app.controller('tourCTL',['$scope','$rootScope','$http','$timeout','$filter','cartService','toursService' ,function($scope,$rootScope,$http,$timeout,$filter,cartService, toursService){
    $scope.init = function(){
      $scope.similar_tours = similar_tours;
      $scope.imgs_url = imgs_url;
      $scope.minDate = new Date();
      $scope.tour = tour;
      $scope.tour.schedules = tour.schedules || [];
      $scope.tour.adults = 1;
      $scope.tour.kids = 0;
      $scope.tour.date = new Date();
      $scope.tour.transfer = $scope.tour.haveTransfer;
      $scope.minDate = new Date();
      $scope.hotels = [];
      $scope.rate_values = rate_values;
      $scope.transfer_prices = transfer_prices;
      $scope.tour.total_price = 0;
      $scope.tour.adult_price = 0;
      $scope.tour.kids_price = 0;
      $scope.tour.transfer_price = 0;
      $scope.tour.maxPaxSize = [];
      if (!$scope.tour.pax) {
          $scope.tour.pax = 8;
      }
      for (var i = 1; i <= $scope.tour.pax; i++) {
        $scope.tour.maxPaxSize.push(i);
      }
      $scope.center = {
          zoom:14,
          lat:21.1656951,
          lng:-86.8210734,
      };
      $scope.layers = {
          baselayers: {
              googleRoadmap: {
                  name: 'Google Streets',
                  layerType: 'ROADMAP',
                  type: 'google'
              }
          }
      };

      $scope.days = $rootScope.currentLang == 'es' ?
          ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'] :
          ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


      $scope.tourDurationFormatted = $scope.formatDuration($scope.tour.duration_formated);
      $scope.tourDuration = $scope.setDuration($scope.tour.days);
      $scope.tour.includesList = $scope.formatList($scope.tour.includes_es);
      $scope.tour.notIncludesList = $scope.formatList($scope.tour.does_not_include_es);
      $scope.searchHotels = [];

      var aux_schedules = [];
      $scope.tour.schedules.forEach(function(el) {
        if( typeof el == 'string' )
          aux_schedules.push(JSON.parse(el));
        else
          aux_schedules.push(el);
      });

      $scope.tour.schedules = aux_schedules;

      $http.get('/hotels').success(function(response) {
          $scope.hotels = response;
          if ($scope.tour.transferHotels && $scope.tour.transferHotels.length > 0) {
              angular.copy($scope.tour.transferHotels,$scope.searchHotels);
          } else {
              angular.copy($scope.hotels,$scope.searchHotels);
          }
          //console.log($scope.searchHotels);
      });

      $scope.date = new Date();
      $scope.date.setDate($scope.date.getDate() + 1);
      $scope.updatePrices($scope.tour);
    };

    $scope.formatList = function(inlineList){
      if(inlineList){
        var list = inlineList.split('\n');
        for(var i=0;i<list.length;i++){
          if(list[i] === ''){
            list.splice(i, 1);
          }
        }
        return list;
      }
      return [];

    }

    $scope.formatDuration = function(duration){
      var formatted = '';
      //console.log(duration);
      if(duration){
        var t = new Date(duration);
        var h = t.getHours() || '';
        var m = t.getMinutes() || '';
        if(h || h>0){
          formatted = h  + ' hr(s).';
        }
        if(m || m>0){
          if(h || h>0) formatted += ', ';
          formatted += m + ' min.';
        }
      }
      if(formatted === ''){
        formatted = '--';
      }
      return formatted;
    }

    $scope.setDuration = function(tourDays){
      var str = '';
      var counter = 0;
      for(var i=0;i<$scope.days.length;i++){
        if(tourDays[i]){
          if(str !== ''){
            str += ', ';
          }
          str += $scope.days[i];
          counter++;
        }
      }
      if(str === '' || counter === tourDays.length){
        str = 'Todos los dias';
      }
      return str;
    };

    $scope.setUpGallery = function(){
      $scope.galleryPhotos = [];
      if($scope.tour.files){
        $scope.galleryPhotos = $scope.tour.files.map(function(file){
          var size = file.size>5000000 ? '593x331' : '';
          return $scope.imgs_url + '/uploads/tours/gallery/' + size +  file.filename;
        });
      }

      if ( $scope.tour.icon ){
        var size = $scope.tour.icon.size>5000000 ? '593x331' : '';
        $scope.galleryPhotos.push(
          $scope.imgs_url + '/uploads/tours/' + size +  $scope.tour.icon.filename
        );
      }

      if( !$scope.tour.files && !$scope.tour.icon ){
          $scope.galleryPhotos.push(
            '/images/default.png'
          );
      }

    };

    $scope.updatePrices = function(tour) {
        $scope.getPrice(tour);
        $scope.getPriceAdults(tour);
        $scope.getPriceKids(tour);
        $scope.getPriceTotal();
        $scope.getPriceTransfer();
    };

    $scope.$on('CURRENCY_CHANGE', function () {
        $scope.updatePrices($scope.tour);
        angular.forEach($scope.similar_tours,function(t){
            $scope.getPrice(t);
        });
    });

    $scope.getPrice = function(tour){
        console.log(tour);
        cartService.getPriceTour(tour,function(res){
            tour.total_tour_price_before = res;
        });
        var applyDiscount = true;
        cartService.getPriceTour(tour, function(res){
          tour.total_tour_price = res;
        }, applyDiscount);
    };

    $scope.getPriceAdults = function(tour) {
          cartService.getPriceAdults(tour,function(res){
              tour.adult_price = res;
          });
    };

    $scope.getPriceKids = function(tour) {
        cartService.getPriceKids(tour,function(res){
            tour.kids_price = res;
        });
    };

    $scope.getPriceTotal = function() {

      cartService.getPriceTourTotal($scope.tour,$scope.transfer_prices).then(function(res){
          $scope.tour.total_price_before = res;
      });

      var applyDiscount = true;
      cartService.getPriceTourTotal($scope.tour,$scope.transfer_prices, applyDiscount).then(function(res){
          $scope.tour.total_price = res;
      });


    };

    $scope.getPriceTransfer = function() {
        if (!$scope.tour.haveTransfer && $scope.tour.hotel) {
            cartService.getPriceTourTransfer($scope.tour,$scope.transfer_prices).then(function(val){
                $scope.tour.transfer_price = val;
            });
        } else {
            $scope.tour.transfer_price = 0;
        }

    };

    $scope.addCartTour = function() {
      //$scope.tour.departurePoint = angular.fromJson($scope.tour.departurePoint);
      console.log($scope.tour);
      cartService.addTour($scope.tour);
      location.href = "/" + $rootScope.currentLang + "/booking";
    };

    $scope.setUpMap = function(){
      var markers = [];

      var getIcon = function(text) {
        var limit = 25;
        var str = $filter('limitTo')(text, limit);
        str += (text.length > 25) ? '...' : '';
        return {
          type: 'div',
          className: 'custom-icon',
          iconSize: [170, 24],
          popupAnchor:  [0, -50],
          html: '<div class="custom-icon-inner"><strong>'+ str +'</strong></div>'
        };
      };

      $scope.map = {};
      $scope.center = {
          zoom:13,
          lat:21.1656951,
          lng:-86.8210734
      };
      $scope.markers = {};
      //console.log($scope.tour.departurePoints);

      if($scope.tour.departurePoints){
          angular.forEach(Object.keys($scope.tour.departurePoints),function(i){
            var tourPoints =  $scope.tour.departurePoints[i];

            markers.push({
                lat: tourPoints.lat,
                lng: tourPoints.lng,
                icon: getIcon(tourPoints.name),
                identifier : tourPoints.identifier,
                name : tourPoints.name
            });

            $scope.center = {
                zoom:12,
                lat: tourPoints.lat,
                lng: tourPoints.lng
            };

            $scope.markers = markers.filter(function(e){
                return e;
            });
        });

      }

      $scope.layers = {
          baselayers: {
              googleRoadmap: {
                  name: 'Google Streets',
                  layerType: 'ROADMAP',
                  type: 'google'
              }
          }
      };
    };

    $scope.init();
    $scope.setUpGallery();

    $timeout(function(){
      $scope.setUpMap();
    },1000);

    $scope.getSubcategories = function(categories,type){
      var aux = [];
      for( var x in categories ){
        if( type == 'sub' ){
          if( !categories[x].principal && (!categories[x].type || ( categories[x].type && categories[x].type != 'rate' )) )
            aux.push( categories[x] );
        }else if( type == 'principal' ){
          if( categories[x].principal )
            aux.push( categories[x] );
        }else if( type == 'rate' ){
          if( categories[x].type && categories[x].type == 'rate' )
            aux.push( categories[x] );
        }
      }
      return aux;
    }
    $scope.getRateValue = function(category){
      for( var x in $scope.rate_values ){
        if( category.id == $scope.rate_values[x].tourcategory_tours && $scope.rate_values[x].value ){
          for( var y in category.rating ){
            category.rating[y] = typeof category.rating[y] == 'string'?JSON.parse(category.rating[y]):category.rating[y];
            if( category.rating[y].value == $scope.rate_values[x].value )
                return category.rating[y].label;
          }
        }
      }
    }

    $scope.getCategoryIcon = function(category){
      return toursService.getCategoryIcon(category);
    }

}]);
