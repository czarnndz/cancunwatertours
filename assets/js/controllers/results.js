app.controller('resultsCTL',function($scope, toursService, $timeout, leafletData){
  $scope.category = category;
  $scope.minFee = minFee;
  $scope.maxFee = maxFee;
  $scope.term = term;
  $scope.page = 1;
  $scope.size = 6;
  $scope.loading = false;
  $scope.toursCategories = [];

  $scope.getCategoriesString = function(tour) {
    return tour.categories.map(function(elem){ return elem.name; }).join(" , ");
  };

  $scope.getToursCategories = function() {
    toursService.getCategories().then(function(res){
      $scope.toursCategories = res;
      console.log($scope.toursCategories);
    });
  };

  $scope.redrawMap = function(){
    $timeout(function(){
      leafletData.getMap().then(function(map) {
        console.log('resize');
        map.invalidateSize();
      });
    },500);
  };

  $scope.getTours = function() {
    $scope.loading = true;
    toursService.getTours($scope.category,minFee,maxFee,term).then(function(res){
      $scope.tours = res;
      $scope.loading = false;
      $scope.redrawMap();
    });
  };

  $scope.init = function(){

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

    $scope.map = {};
    $scope.center = {
        zoom:14,
        lat:21.1656951,
        lng:-86.8210734,
    };
    $scope.markers = {};

    $scope.loading = true;
    toursService.getTours($scope.category,minFee,maxFee,term).then(function(data){
      $scope.loading = false;
      $scope.tours = data;
      angular.forEach(data, function(t){
        var tour = t.departurePoints.item_0;
        tour.price = t.fee;
        var imgSrc = '/images/1.jpg';
        var price = '$'+tour.price+' MX';
        var priceWrap = "<div class='price-wrap'><strong>"+price+"</strong></div>";
        var image = "<div class='img-wrap'><img  src='"+imgSrc+"' />"+priceWrap+"</div>";
        var info ="<p><strong class='map-marker-title'><a>Tour Subasee Explorer</a></strong></p>";
        info += "<p>Categoría: </p>";

        var message = image + info;

        this.push({
          lat: tour.lat,
          lng: tour.lng,
          message: message,
          icon: getIcon(tour.price)
        });
      },markers);
      $scope.markers = markers.filter(function(e){
        return e;
      });
    });

    $scope.layers = {
        baselayers: {
            googleRoadmap: {
                name: 'Google Streets',
                layerType: 'ROADMAP',
                type: 'google'
            }
        }
    };
    $scope.getToursCategories();
  };

  $scope.init();
  $scope.redrawMap();

});
