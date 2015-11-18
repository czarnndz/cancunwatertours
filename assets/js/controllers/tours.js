

app.controller('tourCTL',function($scope,$http,$timeout){
    $scope.init = function(){
      $scope.similar_tours = similar_tours;
      $scope.imgs_url = imgs_url;
      $scope.tour = tour;
      $scope.tour.adults = 1;
      $scope.tour.kids = 0;
      $scope.tour.date = new Date();
      $scope.minDate = new Date();
      $scope.hotels = [];
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
      console.log($scope.tour);
    };

    $http.get('/hotels').success(function(response) {
        $scope.hotels = response;
    });

    $scope.setUpGallery = function(){
      $scope.galleryPhotos = $scope.tour.files.map(function(file){
        return $scope.imgs_url + '/uploads/tours/gallery/593x331' +  file.filename;
      });
    }

    $scope.getPrice = function(){
        if ($scope.kids > 0) {
            return ($scope.tour.adults * $scope.tour.fee) + ($scope.tour.kids * $scope.tour.feeChild);
        } else {
            return ($scope.tour.adults * $scope.tour.fee);
        }
    };

    $scope.setUpMap = function(){
      var markers = [];

      var getIcon = function(text) {
        return {
          type: 'div',
          className: 'custom-icon',
          iconSize: [90, 24],
          popupAnchor:  [0, -50],
          html: '<div class="custom-icon-inner"><strong>$'+ text + ' mx</strong></div>'
        };
      };

      var getPopup = function(img,price,name){
        var imgSrc = '/images/1.jpg';
        var price = '$'+tour.price+' MX';
        var priceWrap = "<div class='price-wrap'><strong>"+price+"</strong></div>";
        var image = "<div class='img-wrap'><img  src='"+imgSrc+"' />"+priceWrap+"</div>";
        var info ="<p><strong class='map-marker-title'><a>Tour Subasee Explorer</a></strong></p>";
      };

      $scope.map = {};
      $scope.center = {
          zoom:14,
          lat:21.1656951,
          lng:-86.8210734,
      };
      $scope.markers = {};

      if($scope.tour.departurePoints){
        var tourPoints =  $scope.tour.departurePoints.item_0;
        var message = getPopup($scope.tour.avatar3, $scope.tour.fee, $scope.tour.name);

        markers.push({
          lat: tourPoints.lat,
          lng: tourPoints.lng,
          message: message,
          icon: getIcon($scope.tour.fee)
        });

        $scope.center = {
            zoom:12,
            lat: tourPoints.lat,
            lng: tourPoints.lng,
        };

        $scope.markers = markers.filter(function(e){
          return e;
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


});
