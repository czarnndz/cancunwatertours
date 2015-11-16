app.controller('transfersCTL',function($scope,$http){
  //Var define section start
  var startDate = new Date();
  var endDate = new Date();
  endDate.setDate(startDate.getDate()+4);
  startDate.setDate(startDate.getDate()+2);
  $scope.services = services;
  $scope.hotels = '';
  $scope.airports = [];//airports;
  $scope.theairport = 'false';
  $scope.maxPax = [];
  $scope.origins = origins_;
  $scope.hrs = [];
  $scope.mins = [];
  $scope.time_ = ['am','pm'];
  $scope.adDisabled = [false,false]; //0 arrival 1 departure
  $scope.steps = 0;
  $scope.lang_ = lang_;
  $scope.inputChange = function(){
    if( typeof $scope.reserve.hotel === 'undefined' ){
      $scope.steps = 0;
      $scope.reserve.service = false;
      $scope.reserve.airport = false;
    }
  }
  $scope.stepChange = function(item,index){
    if( item=='hotel' ){
      $scope.hotelSelected();
      $scope.steps = 1;
    }else{
      $scope.steps = index;
      if(index==2)
        $scope.reserve.service = false;
      $scope.getPrice();
      $scope.getName();
    }
  }
  for(var i = 0; i < 60; i++){ 
    $scope.mins.push(i); 
    if( i > 0 )
      $scope.maxPax.push(i); 
    if( i > 0 && i < 13 )
      $scope.hrs.push(i);
  };
  $scope.carImage = '1.png';
  //Define section end
  $scope.rid = ( ( Math.random() * 100000 ) + 'AHT' );
  $scope.reserve = {
    service: false,
    reservation_type : 'transfer', type : 'round_trip',
    hotel : '', quantity : 1,airport : false, 
    arrival_date : startDate , departure_date : endDate,
    pax : 1 , origin : $scope.origins[0],
    fee : 0, rName : '',
    aTimeHr : 1, aTimeMin : 0, aTimeT : 'am',
    dTimeHr : 1, dTimeMin : 0, dTimeT : 'am',
    arrival_fly : '', departure_fly : '', notes : ''
  };
  $scope.client_ = {name : '', secondphone : '', last_name : '', email : '', phone : ''};
  $scope.getName = function(){
    var result = "Traslado de ";
    if( $scope.reserve.origin.handle == 'hotel' ){
      result += ( $scope.reserve.hotel.name || ' "Selecciona tú hotel de origen" ') + ' a ' + ($scope.reserve.airport.name || '"selecciona tú aeropuerto destino"');
    }else{
      result += ($scope.reserve.airport.name || '"Selecciona tú aeropuerto destino" ') + ' a ' + ( $scope.reserve.hotel?$scope.reserve.hotel.name : ' "selecciona tú hotel de partida" ');
    }
    $scope.reserve.rName = result;
  };
  $scope.getCarImage = function(){
    var $cars = ['1.png','2.png','3.png','4.png'];
    var $x = 0;
    var pax = parseInt($scope.reserve.service.max_pax);
    if( pax > 4 && pax <= 6 ){$x = 3;}
    else if( pax > 6 && pax <=12 ){ $x = 1; }
    $scope.carImage = $cars[$x];
  };
  $scope.getPrice = function(){
    if( $scope.reserve.airport != false && $scope.reserve.service != ''){
      var params = { 
        'zone1' : $scope.reserve.hotel.zone , 'zone2' : $scope.reserve.airport.zone , 
        'location' : $scope.reserve.hotel.location , 'transfer' : $scope.reserve.service.id ,
        'type' : $scope.reserve.type
      };
      $http.post('/transfer/getPrice',params,{}).success(function(result){
        if(result){ 
          if( $scope.reserve.type == 'one_way' )
            $scope.reserve.fee = result.one_way;
          else
            $scope.reserve.fee = result.round_trip;
        }
        $scope.getName();
        $scope.getCarImage();
        $scope.reserve.quantity = Math.ceil($scope.reserve.pax/$scope.reserve.service.max_pax);
      });
    }
  };
  $scope.getName();
  $scope.getCarImage();
  $scope.getHotels = function(){
    var skip = ($scope.currentPage-1) * 20;
    var term = $scope.term;
    var params  = { term : term , skip : skip };
    $http.post('/hotel/gethotels',params,{}).success(function(result){
      if(result) $scope.hotels = result;
    });
  }
  /*Open close datepicker*/
  $scope.open = function($event,opened) {
    $event.preventDefault();
    $event.stopPropagation();
    if( opened == 'initO' ){
      $scope.opened = true;
      $scope.opened2 = false;
    }else{
      $scope.opened = false;
      $scope.opened2 = true;
    }
  }
  $scope.updateType = function(){
    var h = $scope.reserve.origin.handle== 'hotel'?true:false;
    var r = $scope.reserve.type == 'round_trip'?true:false;
    $scope.adDisabled[0] = !(( h && r ) || (!h));
    $scope.adDisabled[1] = !(( !h && r ) || h);
    $scope.updateType();
  }
  $scope.reservationTransfer = function(){
    var params = { 'client_' : $scope.client_ , 'reservation' : $scope.reserve };
    $http.post('/transfer/generateOrder',params,{}).success(function(result){ });
  }
  $scope.hotelSelected = function(){
    var params  = { 'location' : $scope.reserve.hotel.location };
    $http.post('/transfer/getAirports',params,{}).success(function(result){
      $scope.airports = result;
      $scope.getPrice();
      $scope.getName();
      $('#airport_input').trigger('liszt:updated');
      $('#airport_input').trigger('chosen:updated');
    });
  }
  $scope.getAutocomplete = function(term){
    var params  = { term : term , skip : 0 };
    return $http.post('/hotel/gethotels',params,{}).then(function(res){ return res.data; });
  }
});