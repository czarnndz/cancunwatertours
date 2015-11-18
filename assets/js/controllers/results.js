app.controller('resultsCTL',function($scope, toursService, $timeout, leafletData){
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
    var idx = false;
    list.forEach(function(item,key){
      if( list[key].id == item.id ){
        idx = key;
      }
    });
    if(idx) list.splice(idx, 1);
    else list.push({ id: item, type : type , tours : item.tours });
    //console.log(list);
  };
  $scope.exists = function(item, list){ return list.indexOf(item) > -1; };
  $scope.formatRatings = function(item,list,value){
    var idx = false;
    for(var x in list){
      if( list[x].id == item.id ){
        idx = x; break;
      }
    }
    if(idx && value <= 0 )
      list.splice(idx, 1);
    else if(value>0){
      var aux_t = [];
      aux_t.push(item.tours);
      if( idx ){
        list[idx].value = value;
        list[idx].tours = aux_t;
      }else{
        list.push({ id: item, type : 'rating' , tours : aux_t, value : value });
      }
    }
    //console.log(list);
  };
  $scope.updatePricesRange = function(){
    toursService.getFeeRange().then(function(res){
      $scope.range = res;
    });
  };
  $scope.getCategoriesByTours = function(){
    $scope.subcategories = [];
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
      $scope.tours = res;
      $scope.loading = false;
      $scope.redrawMap();
      $scope.updatePricesRange();
      $scope.getCategoriesByTours();
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
      $scope.updatePricesRange();
      $scope.getCategoriesByTours();
      angular.forEach(data, function(t){
        var tour = t.departurePoints.item_0;
        tour.price = t.fee;
        var imgSrc = t.avatar3;
        var price = '$'+tour.price+' MX';
        var priceWrap = "<div class='price-wrap'><strong>"+price+"</strong></div>";
        var image = "<div class='img-wrap'><img  src='"+imgSrc+"' />"+priceWrap+"</div>";
        var info ="<p><strong class='map-marker-title'><a href='/detalle/"+tour.id+"' target='_blank'>"+t.name_es+"</a></strong></p>";

        var categories = '';
        for(var i=0;i<t.categories.length;i++){
          categories += '<a href="/resultados?category='+t.categories[i].id+'" target="_blank">' + t.categories[i].name + '</a>';
          if(i !== (categories.length) ){
            categories += ', ';
          }
        }

        info += "<p>Categorías: "+categories+"</p>";

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

      if($scope.markers.length > 0){
        $scope.center = {
            zoom:14,
            lat:$scope.markers[0].lat,
            lng:$scope.markers[0].lng,
        };
      }

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
