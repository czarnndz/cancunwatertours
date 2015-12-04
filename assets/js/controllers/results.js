
app.controller('resultsCTL',function($scope, $timeout, $filter, toursService, leafletData,cartService,$rootScope){
  $scope.category = category;
  $scope.subcategories = []; //sec_categories
  $scope.rate_categories = rate_categories || [];
  $scope.tours = [];
  $scope.minFee = minFee;
  $scope.maxFee = maxFee;
  $scope.term = term;
  $scope.page = 1;
  $scope.size = 6;
  $scope.loading = false;
  $scope.toursCategories = [];
  $scope.range = { id:'0', name:'prices' ,minFee : 0, maxFee : 1, tours:[] };
  $scope.selected = [];
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
          }
        }
      }
    }
  };

  $scope.getCategoriesString = function(tour) {
    return tour.categories.map(function(elem){ return elem.name; }).join(" , ");
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

  $scope.getTours = function() {
    $scope.loading = true;
    toursService.getTours($scope.category,minFee,maxFee,term).then(function(res){
      //console.log(res);
      $scope.tours = res;
      $scope.loading = false;
      $scope.redrawMap();
      $scope.updatePricesRange();
      $scope.getCategoriesByTours();
    });
  };

  $scope.getPriceTour = function(tour){
    return cartService.getPriceTour(tour);
  };

  $scope.initMap = function(){
    $scope.map = {};
    $scope.center = {
        zoom:14,
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

    $scope.getPopup = function(tour){
      var imgSrc = tour.avatar3;
      var price = $filter('currency')(cartService.getPriceTour(tour)) + $filter('uppercase')($rootScope.global_currency.currency_code);
      var priceWrap = "<div class='price-wrap'><strong>"+price+"</strong></div>";
      var image = "<div class='img-wrap'><img  src='"+imgSrc+"' />"+priceWrap+"</div>";
      var info ="<p><strong class='map-marker-title'><a href='/tour/"+tour.url+"' target='_blank'>"+tour.name+"</a></strong></p>";

      var popup =  image + info;

      if(tour.categories){

        var categories = '';
        var categoriesStr = '';
        for(var i=0;i<tour.categories.length;i++){
          categories += '<a href="/tours/'+tour.categories[i].url+'" target="_blank">' + tour.categories[i].name + '</a>';

          if(i !== (categories.length) ){
            categories += ', ';
          }
        }
        categoriesStr += "<p>Categorías: "+categories+"</p>";
        popup += categoriesStr;
      }

      return popup;
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
            "layerOptions": {
            "chunkedLoading": true,
            "showCoverageOnHover": false,
            "removeOutsideVisibleBounds": true
            }
          }
        }
    };
  };

  $scope.init = function(){
    var markers = [];
    $scope.loading = true;
    $scope.initMap();
    toursService.getTours($scope.category,minFee,maxFee,term).then(function(data){
      $scope.loading = false;
      $scope.tours = data;
      $scope.updatePricesRange();
      $scope.getCategoriesByTours();
      angular.forEach(data, function(t){
        var info = '';

        var tour = t.departurePoints.item_0;
        var message = $scope.getPopup(t);

        this.push({
          layer: 'Locations',
          lat: tour.lat,
          lng: tour.lng,
          message: message,
          icon: $scope.getIcon(t.name)
        });

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

    $scope.getToursCategories();

  };

  $scope.init();
  $scope.redrawMap();

});
