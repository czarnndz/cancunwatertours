app.controller('resultsCTL',function($scope){
  console.log('en resultsCTL');
  $scope.init = function(){

    var markers = [];
    var data = [
      {lat:21.1656951,lng:-86.8210734,price:520},
      {lat:21.1516483,lng:-86.8239134,price:760},
      {lat:21.153111,lng:-86.821039,price:659},
    ];
    var getIcon = function(text) {
      return {
        type: 'div',
        className: 'custom-icon',
        iconSize: [90, 24],
        popupAnchor:  [0, -50],
        html: '<strong>$'+ text + ' mx</strong>'
      };
    };

    $scope.map = {};
    $scope.center = {
        zoom:14,
        lat:21.1656951,
        lng:-86.8210734,
    };
    $scope.markers = {};

    angular.forEach(data, function(tour){
      var imgSrc = '/images/1.jpg';
      var price = '$'+tour.price+' MX';
      var priceWrap = "<div class='price-wrap'><strong>"+price+"</strong></div>";
      var image = "<div class='img-wrap'><img  src='"+imgSrc+"' />"+priceWrap+"</div>";
      var info ="<p><strong class='map-marker-title'><a>Tour Subasee Explorer</a></strong></p>";
      info += "<p>Categoría: <a href='#'>Aventura</a>, <a href='#'>Buceo</a></p>";

      var message = image + info;

      markers.push({
        lat: tour.lat,
        lng: tour.lng,
        message: message,
        icon: getIcon(tour.price)
      });
    });

    $scope.markers = markers.filter(function(e){
      return e;
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
  };

  $scope.init();

});
