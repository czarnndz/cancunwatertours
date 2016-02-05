
app.controller('resultsCTL',function($scope,$http, $rootScope, $timeout, $filter, toursService, leafletData,cartService){
  $scope.category = category;
  $scope.subcategories = []; //sec_categories
  $scope.rate_categories = rate_categories || [];
  $scope.tours = [];
  $scope.hotels = [];
  $scope.minFee = minFee;
  $scope.maxFee = maxFee;
  $scope.term = term;
  $scope.page = 1;
  $scope.size = 6;
  $scope.loading = false;
  $scope.toursCategories = [];
  $scope.range = { id:'0', name:'prices' ,minFee : 0, maxFee : 1, tours:[] };
  $scope.selected = [];
  $scope.orderBy = 'dtCreated';
  console.log($scope.rate_categories);
  console.log($scope.range);

  $scope.getHotels = function(){
      $http.get('/hotels').success(function(response) {
          $scope.hotels = [];
          for(var x in response)
            if( response[x].latitude && response[x].longitude )
              $scope.hotels.push(response[x]);
      });
  };
  $scope.changeHotelMap = function(hotel){
    for( var x in $scope.markers ){
      if( $scope.markers[x].layer = 'Locations' )
        $scope.markers.splice(x,1);
    }
    if( hotel && hotel.latitude && hotel.longitude ){
        $scope.markers.push({
          lat : hotel.latitude
          ,lng : hotel.longitude
          ,message : hotel.name
          ,focus:true
        });
      }
  }
  $scope.getHotels();
  $scope.toggle = function(item, list, type){
    var idx = -1;
    for(var i=0; i < list.length; i++) {
      if( list[i].id == item.id ){
        idx = i;
      }
    }
    if(idx >= 0) list.splice(idx, 1);
    else list.push(item);
  };
  $scope.exists = function(item, list){ return list.indexOf(item) > -1; };

  $scope.formatRatings = function(item,list,value){
    var idx = -1;
    for(var i=0; i < list.length; i++) {
      if( list[i].id == item.id ){
        idx = i;
      }
    }
    if(idx >= 0 && value <= 0 )
      list.splice(idx, 1);
    else if(value>0){
      if( idx >= 0  ){
        list[idx].value = value;
        list[idx].tours = item.tours;
      }else{
        item.value = value;
        list.push(item);
      }
    }
    console.log(list);
    console.log(value);
    console.log(idx);
  };
  $scope.updatePricesRange = function(){
    toursService.getFeeRange().then(function(res){
      $scope.range = res;
    });
  };
  $scope.getCategoriesByTours = function(){
    $scope.subcategories = [];
    //console.log(sec_categories);

    var aux = [];
    for( var x in sec_categories ){
      for( var y in $scope.tours ){
        for( var z in $scope.tours[y].categories ){
          if( $scope.tours[y].categories[z].id == sec_categories[x].id && aux.indexOf(sec_categories[x].id)<0 ){
            $scope.subcategories.push( sec_categories[x] );
            aux.push(sec_categories[x].id);
            //console.log(sec_categories[x]);
          }
        }
      }
    }
  };


  $scope.getCategoriesString = function(tour) {
    var categories =  tour.categories.filter(function(elem){
      return (elem.type != 'rate')
    });

    return categories.map(function(elem){
      var name = ($rootScope.currentLang === 'es') ? elem.name : elem.name_en;
      return name;
    }).join(" | ");
  };
  $scope.getCategoryIcon = function(category){
    return toursService.getCategoryIcon(category);
  }

  $scope.getToursCategories = function() {
    toursService.getCategories().then(function(res){
      $scope.toursCategories = res;
      //console.log($scope.toursCategories);
    });
  };

  $scope.redrawMap = function(){
    $timeout(function(){
      leafletData.getMap().then(function(map) {
        map.invalidateSize();
      });
    },500);
  };

  $scope.updatePrices = function(){
      angular.forEach($scope.tours,function(t){
          cartService.getPriceTour(t,function(val){
              t.total_price = val;
          })
      });
  };

  $scope.initMap = function(){
    $scope.map = {};
    $scope.center = {
        zoom:9,
        lat:21.1656951,
        lng:-86.8210734,
    };
    $scope.markers = {};

    $scope.getIcon = function(text) {
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
    var printCategoriesByTour = function(tour){
      var categoriesLabel = ($rootScope.currentLang === 'es') ? 'Categorías' : 'Categories';
      var categoriesStr = '';
      if(tour.categories){
        var categories = '';
        for(var i=0;i<tour.categories.length;i++){
          var category_name = ($rootScope.currentLang === 'es') ? tour.categories[i].name : tour.categories[i].name_en;
          categories += '<a href="/'+$rootScope.currentLang+'/tours/'+tour.categories[i].url+'" target="_blank">' + category_name + '</a>';

          if(i !== (categories.length) ) categories += ', ';
        }
        categoriesStr += "<p>"+categoriesLabel+": "+categories+"</p>";
      }
      return categoriesStr;
    }
    $scope.getPopup = function(tours){
      //new popup
      var reel = '';
      for( var x in tours ){
        var tour = tours[x];
        var tour_name = ($rootScope.lang === 'es') ? tour.name : tour.name_en;
        cartService.getPriceTour(tour,function(val) {
            var item = '';
            var price = $filter('currency')(val) + $filter('uppercase')($rootScope.global_currency.currency_code);
            var priceWrap = "<div class='price-wrap'><strong>"+price+"</strong></div>";
            tour.total_price = val;
            item += "<div class='img-wrap'><img  src='"+tour.avatar3+"' />"+priceWrap+"</div>";
            item += "<p><strong class='map-marker-title'><a href='/"+$rootScope.currentLang+"/tour/"+tour.url+"' target='_blank'>"+tour_name+"</a></strong></p>";
            item += printCategoriesByTour(tour);
            item = "<div>" + item + "</div>";
            reel += item;
        });

      }
      reel = '<slick ng-cloak style="width:100%;min-height:200px;margin:0;" class="ng-cloak" dots="false" arrows="true" autoplay="false" fade="false">' + reel + "</slick>";

      return reel;
    };

    $scope.events = {
      map: {
        enable: ['moveend', 'popupopen'],
        logic: 'emit'
      },
      marker: {
        enable: [],
        logic: 'emit'
      }
    },

    $scope.layers = {
        baselayers: {
            googleRoadmap: {
                name: 'Google Streets',
                layerType: 'ROADMAP',
                type: 'google'
            }
        },
        overlays: {
          Locations: {
            "name": "Locations",
            "type": "markercluster",
            "visible": true,
            /*"layerOptions": {
            "chunkedLoading": true,
            "showCoverageOnHover": false,
            "removeOutsideVisibleBounds": true
            }*/
          }
        }
    };
  };


  $scope.$on('leafletDirectiveMap.popupopen', function(e, args) {
    leafletData.getMap().then(function(map) {

      $timeout(function(){
        var lat = args.leafletObject._popup._latlng.lat;
        var lng = args.leafletObject._popup._latlng.lng;

        var lpos = L.latLng(parseFloat(lat), parseFloat(lng));
        var px = map.project(lpos); // find the pixel location on the map where the popup anchor is

        px.y -= args.leafletObject._popup._container.clientHeight/2; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location

        var currentZoom = $scope.center.zoom;
        var coords = map.unproject(px);

        angular.extend($scope, {
          center: {
            lat: coords.lat,
            lng: coords.lng,
            zoom: currentZoom
          }
        });

      },400);

      //map.panTo(map.unproject(px),{animate: true}); // pan to new center
    });

  });


  $scope.init = function(){
    var markers = [];
    $scope.loading = true;
    $scope.initMap();
    $scope.getToursCategories();
    toursService.getTours($scope.category,minFee,maxFee,term,true).then(function(data){
      $scope.loading = false;
      $scope.tours = data;
      $scope.updatePricesRange();
      $scope.getCategoriesByTours();
      $scope.muelles = {};
      var markerTxt = ($rootScope.currentLang === 'es') ? ' actividades aquí' : ' activities here';
      angular.forEach(data, function(t){

        if( t.provider && t.provider.departurePoints ){
          if( !$scope.muelles[t.provider.id] )
            $scope.muelles[t.provider.id] = { points : [] , tours : [] };
          for(var x in t.provider.departurePoints ){
            $scope.muelles[t.provider.id].points.push( t.provider.departurePoints[x] );
            $scope.muelles[t.provider.id].tours.push( t );
          }
          var message = $scope.getPopup($scope.muelles[t.provider.id].tours);
          for(var x in $scope.muelles[t.provider.id].points){
            var iconText = $scope.muelles[t.provider.id].tours.length>1?$scope.muelles[t.provider.id].tours.length+ markerTxt : $scope.muelles[t.provider.id].tours[0].name;
            this.push({
              lat: $scope.muelles[t.provider.id].points[x].lat,
              lng: $scope.muelles[t.provider.id].points[x].lng,
              message: message,
              popupOptions:{
                autoPan: false
              },
              getMessageScope : function() { return $scope; },
              icon: $scope.getIcon( iconText )
            });
          }
        }

      },markers);
      $scope.markers = markers.filter(function(e){
        return e;
      });

      if($scope.markers.length > 0){
        $scope.center = {
            zoom:14,
            lat:$scope.markers[0].lat,
            lng:$scope.markers[0].lng,
        };
      }

    });
  };

  $scope.$on('CURRENCY_CHANGE', function () {
      $scope.updatePrices();
  });

  $scope.init();
  $scope.redrawMap();

});
