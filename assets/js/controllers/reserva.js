app.controller('reservaCTL',['$scope','$http','$filter','toursService','cartService','countries', 'countriesStates' ,function($scope,$http,$filter,toursService,cartService,countries,countriesStates) {
    $scope.cartService = cartService;
    $scope.city = '';
    $scope.blinkClass = false;
    $scope.client = window.client || {name:'',last_name:'',email:''};
    $scope.client.isMobile = false;
    $scope.countries = countries;
    if (!cartService.getClient().name) {
      cartService.setClient($scope.client);
    }
    $scope.states = [];

    /*$scope.client = {
        isMobile : false
    };*/

    $scope.minDate = new Date();
    $scope.hotels = hotels;
    $scope.isDisabled = true;
    $scope.terminos = false;
    $scope.isLoading = false;

    $scope.cartComplete = window.cartComplete || false;
    $scope.clientComplete = false;

    $scope.step = $scope.cartComplete  ? 1 : 0;
    $scope.transfer_prices = transfer_prices;
    $scope.tours = cartService.getAll();

//    $scope.tours.forEach(function(tour,a){
//        console.log(a);
//        var aux_schedules = [];
//        tour.schedules.forEach(function(el) {
//            if( typeof el == 'string' )
//                aux_schedules.push(JSON.parse(el));
//            else
//                aux_schedules.push(el);
//        });
//
//        tour.schedules = aux_schedules;
//    });

    //Fix md-datepicker
    for(var i=0;i<$scope.tours.length;i++){
        $scope.tours[i].date = new Date($scope.tours[i].date);
        //$scope.tours[i].departurePoint = angular.fromJson($scope.tours[i].departurePoint);
        //console.log($scope.tours[i].departurePoint);
        $scope.tours[i].maxPaxSize = [];
        if (!$scope.tours[i].pax) {
            $scope.tours[i].pax = 8;
        }
        for (var j = 1; j <= $scope.tours[i].pax ; j++) {
            $scope.tours[i].maxPaxSize.push(j);
        }
    }
    console.log($scope.tours);

    $scope.continueShopping = function() {
      location.href = "/";
    };

    $scope.continueClick = function($event){
      if( !$scope.isNextButtonDisabled($event) ){
          if ($scope.step < 2) {
            $scope.step++;
          }
      }
    }

    /*window.onbeforeunload = function (event) {
      var message = 'Sure you want to leave?';
      if (typeof event == 'undefined') {
        event = window.event;
      }
      if (event) {
        event.returnValue = message;
      }
      return message;
    }*/

    $scope.isNextButtonDisabled = function($event) {
        if ($scope.step == 0) {
          for(var i = 0;i<$scope.tours.length;i++) {
            if ($scope.tours[i].transfer && !$scope.tours[i].hotel) {
              console.log('no hotel selected');
              $scope.cartComplete = false;
              return true;
            }
          }
          $scope.cartComplete = true;
          return false;
        } else if ($scope.step == 1) {
            $scope.validatingClient = true;
            if ($scope.client.name.$invalid || $scope.client.last_name.$invalid || $scope.client.email.$invalid || ($scope.repeat_email != $scope.client.email) ){
              var options = {
                title: 'Revisa tu información',
                message: 'Revisa la información e intenta de nuevo'
              };
              $scope.showAlert($event, options);
              $scope.clientComplete = false;
              return true;
            }
            else{
              console.log('not disabled');
              $scope.clientComplete = true;
              return false;
            }
        }
    };

    $scope.removeTour = function(index) {
        cartService.removeItem(index);
        $scope.tours = cartService.getAll();
        $scope.getPriceTotal();
    };
//
    $scope.$watch($scope.total, function(newValue, oldValue){
      if(newValue !== oldValue){
        $scope.blinkClass = true;
        $timeout(function(){
          $scope.blinkClass = false;
        }, 2000);
      }
    });

    $scope.getPriceTotal = function(){
        cartService.getPriceTotal($scope.transfer_prices).then(function(res){
            //console.log(res);
            $scope.total = res;
        });
    };

    $scope.priceTax = function(tour){
      cartService.getPriceTourTax(tour,function(price){
          tour.tax_price = price;
      });
    }

    $scope.priceTransfer = function(tour) {
      cartService.getPriceTourTransfer(tour,$scope.transfer_prices).then(function(val){
          tour.transfer_price = val;
      });
    };

    $scope.priceTour = function(tour){
        cartService.getPriceTour(tour,function(val){
            tour.total_price = val;
        });
    }

    $scope.updatePrices = function(tour) {
        $scope.priceTour(tour);
        $scope.priceTax(tour);
        $scope.priceTransfer(tour);
        $scope.getPriceTotal();
    };

    $scope.$on('CURRENCY_CHANGE', function () {
        angular.forEach($scope.tours,function(t){
            $scope.updatePrices(t);
        });
    });

    $scope.hasDeparturePoints = function(tour){
      //console.log(tour);
      //return Object.keys(tour.departurePoints).length > 0;
      if( ('departurePoints' in tour) ){
        return true;
      }
      return false;
    };

    //TODO formatear para enviar los items formateados.
    $scope.process = function($event, form) {
      $scope.validatingPayment = true;
      if(form.$valid){
        //console.log('valido');
        $scope.isLoading = true;
        cartService.process($scope.client).then(function(result){
          $scope.isLoading = false;
          //console.log(result);
          if (result.data.success) {
            //console.log('success');
            if (result.data.redirect_url) {
                console.log(result.data.redirect_url);
                window.location.href = result.data.redirect_url;
            } else
                console.log(result.data);
          } else {
            console.log(result.data);
            alert(result.data.error.message_to_purchaser);
          }
        }).catch(function(e){
          $scope.isLoading = false;
          if(e){
            alert(e.message_to_purchaser);
          }
        });

      }else{
        //console.log('invalido');
        var options = {
          title: 'Revisa tu información',
          message: 'Revisa la información e intenta de nuevo'
        };
        $scope.showAlert($event, options);
      }
    };

    $scope.getStatesbyCountry = function(countryCode){
      if(countryCode != ''){
        var aux = countriesStates.filter(function(country){
          return country.countryCode === countryCode;
        });
        if(aux.length > 0){
          $scope.states = aux[0].states;
        }
      }
    };

    $scope.$watch('client.country', function(newValue, oldValue){
      if(newValue !== oldValue){
        $scope.getStatesbyCountry(newValue);
      }
    });

}]);

app.controller('voucherCTL',['$scope','cartService', function($scope,cartService) {
  $scope.reservations = reservations;
  $scope.order = theorder;
  $scope.error = hasError;
  $scope.cartService = cartService;
  $scope.currency = company.currencies.reduce(function(c) {
      if (reservations[0].currency == c.id) {
          return c.currency_code;
      }
  });
  $scope.total_reservations = 0;

  //console.log(reservations);

    var formatList = function(inlineList){
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
    };

    $scope.reservations.forEach(function(e){
        if (e.reservation_type == 'tour') {
            e.feeChild = e.feeKids;
            e.adults = e.pax;
            e.kids = e.kidPax;
            e.schedule = JSON.parse(e.schedule);
            e.total = e.fee + e.feeKids;
            e.tour.includesList = formatList(e.tour.includes_es);
            e.tour.notIncludesList = formatList(e.tour.does_not_include_es);
            $scope.total_reservations += e.total;
        }
        if (e.reservation_type == 'transfer') {
            e.feeChild = e.feeKids;
            e.adults = e.pax;
            e.kids = e.kidPax;
            e.total = e.fee + e.feeKids;
            $scope.total_reservations += e.total;
        }

    });
}]);
