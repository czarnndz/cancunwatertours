

app.controller('tourCTL',function($scope,$rootScope,$http,$timeout,$filter,cartService, toursService){
    $scope.init = function(){
      $scope.similar_tours = similar_tours;
      $scope.imgs_url = imgs_url;
      $scope.minDate = new Date();
      $scope.tour = tour;
      $scope.tour.schedules = tour.schedules || [];
      $scope.tour.adults = 1;
      $scope.tour.kids = 0;
      $scope.tour.date = new Date();
      $scope.minDate = new Date();
      $scope.hotels = [];
      $scope.rate_values = rate_values;
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

      $scope.days = [
        'Lunes',
        'Martes',
        'Miercoles',
        'Jueves',
        'Viernes',
        'Sabado',
        'Domingo'
      ];

      $scope.tourDurationFormatted = $scope.formatDuration($scope.tour.duration_formated);
      $scope.tourDuration = $scope.setDuration($scope.tour.days);
      $scope.tour.includesList = $scope.formatList($scope.tour.includes_es);
      $scope.tour.notIncludesList = $scope.formatList($scope.tour.does_not_include_es);

      var aux_schedules = [];
      $scope.tour.schedules.forEach(function(el) {
        if( typeof el == 'string' )
          aux_schedules.push(JSON.parse(el));
        else
          aux_schedules.push(el);
      });

      $scope.tour.schedules = aux_schedules;

      $http.get('/'+$rootScope.currentLang+'/hotels').success(function(response) {
        $scope.hotels = response;
      });

      $scope.date = new Date();

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
          return $scope.imgs_url + '/uploads/tours/gallery/' +  file.filename;
        });
      }else if ( $scope.tour.icon){
        $scope.galleryPhotos.push(
          $scope.imgs_url + '/uploads/tours/' +  $scope.tour.icon.filename
        );
      } else {
          $scope.galleryPhotos.push(
            $scope.imgs_url + '/uploads/tours/default.jpg'
          );
      }
    };

    $scope.getPrice = function(tour){
        return cartService.getPriceTour(tour);
    };

    $scope.getPriceAdults = function(tour) {
      return cartService.getPriceAdults(tour);
    };

    $scope.getPriceKids = function(tour) {
      return cartService.getPriceKids(tour);
    };

    $scope.addCartTour = function() {
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
          lng:-86.8210734,
      };
      $scope.markers = {};

      if($scope.tour.departurePoints){
          angular.forEach(Object.keys($scope.tour.departurePoints),function(i){
            var tourPoints =  $scope.tour.departurePoints[i];

            markers.push({
                lat: tourPoints.lat,
                lng: tourPoints.lng,
                icon: getIcon(tourPoints.name)
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

});
