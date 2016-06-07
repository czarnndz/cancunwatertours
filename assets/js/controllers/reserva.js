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
    $scope.validPhones = true;

    $scope.cartComplete = window.cartComplete || false;
    $scope.clientComplete = false;

    $scope.step = $scope.cartComplete  ? 1 : 0;
    $scope.transfer_prices = transfer_prices;
    $scope.tours = [];

    $scope.init = function(){
      cartService.getAll().then(function(res){

        $scope.tours = res;
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

      });
    };

    $scope.continueShopping = function() {
      location.href = "/";
    };

    $scope.continueClick = function($event){
      if( !$scope.isNextButtonDisabled($event) ){
          if ($scope.step < 2) {
            $scope.step++;
          }
          $scope.scrollTop();
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

    function restoreFromSessionStorage() {
      var clienJson = sessionStorage['clientInfoSave'];
      var lastStep = sessionStorage['clientInfoSaveStep'];
      var repeatEmail = sessionStorage['clientInfoSaveRepeatMail'];

      if(clienJson) {
        var client = JSON.parse(clienJson);
        if (lastStep > 1) {
          $scope.cartComplete = true;
          $scope.validatingClient = true;
          $scope.clientComplete = true;
        }

        if (repeatEmail) {
          $scope.repeat_email = repeatEmail;
        }
        var client = JSON.parse(clienJson);
        if (client.name) {
          angular.extend($scope.client, client);
          $scope.step = lastStep;
        }
      }
    }

    window.onbeforeunload = function (event) {
      if ($scope.isPayBooking) {
        sessionStorage.clear();
      } else if (window.sessionStorage && sessionStorage.setItem && $scope.client != {}) {
        sessionStorage.setItem('clientInfoSave', JSON.stringify($scope.client));
        if ($scope.repeat_email) {
          sessionStorage.setItem('clientInfoSaveRepeatMail', $scope.repeat_email);
        }
        sessionStorage.setItem('clientInfoSaveStep', $scope.step);
      }
    }
    if (window.sessionStorage && sessionStorage['clientInfoSave'] && sessionStorage['clientInfoSaveStep']) {
      restoreFromSessionStorage();
    }


    $scope.isNextButtonDisabled = function($event) {
        if($scope.tours.length > 0){
          if ($scope.step == 0) {
            /*
            for(var i = 0;i<$scope.tours.length;i++) {
              if ($scope.tours[i].transfer && !$scope.tours[i].hotel) {
                console.log('no hotel selected');
                $scope.cartComplete = false;
                return true;
              }
            }
            */
            $scope.cartComplete = true;
            return false;
          } else if ($scope.step == 1) {
              $scope.validatingClient = true;
              if (!$scope.validateClientPhones() || $scope.client.name.$invalid || $scope.client.last_name.$invalid || $scope.client.email.$invalid || ($scope.repeat_email != $scope.client.email) ){
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
        }
        return true;
    };

    $scope.validateClientPhones = function(){
      var validPhoneLada = $scope.client.phone_lada ? isFinite($scope.client.phone_lada) : null;
      if( isFinite($scope.client.phone) && (validPhoneLada || validPhoneLada === null)){
        if($scope.client.phone.length >= 7 && (($scope.client.phone_lada && $scope.client.phone_lada.length >= 3) || validPhoneLada === null) ){
          $scope.validPhones = true;
          return true;
        }
      }
      $scope.validPhones = false;
      return false;
    };

    $scope.removeTour = function(index) {
        cartService.removeItem(index);
        //$scope.tours = cartService.getAll();
        cartService.getAll().then(function(res){
          $scope.tours = res;
          $scope.getPriceTotal();
        });
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
        cartService.getPriceTotal($scope.transfer_prices, $scope.isGlobalDiscountActive).then(function(res){
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
            tour.total_price_before = val;
        });

        cartService.getPriceTour(tour,function(val){
            tour.total_price = val;
        }, $scope.isGlobalDiscountActive);
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
        $scope.isPayBooking = true;
        $scope.isLoading = true;
        $scope.scrollTop();
        console.log($scope.client);
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

    $scope.getSavedAmmount = function(){
      var saved = 0;
      $scope.tours.forEach(function(tour){
        saved += (tour.total_price_before - tour.total_price);
      });
      return saved;
    };

    $scope.init();


    function isPierTax(tour) {
      if (!tour || !tour.noincludes)
        return false;

      return tour.noincludes.filter(function(el) {
        return el.match(/(pier|dock|muelle)/ig);
      }).length;
    }

    $scope.hasPierTax = function(tours) {
      if (!tours || !tours.length)
        return false;
      return tours.filter(isPierTax).length;
    };


}]);

app.controller('voucherCTL',['$scope', '$window','cartService', function($scope, $window,cartService) {
  $scope.reservations = reservations;
  $scope.order = theorder;
  $scope.error = hasError || false;

  if($scope.error == 'false' || $scope.error == 'none'){
    $scope.error = false;
  }

  console.log($scope.error);

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
        console.log(e);
        if (e.reservation_type == 'tour') {
            e.feeChild = e.feeKids;
            e.adults = e.pax;
            e.kids = e.kidPax;
            e.schedule = (e.schedule!='') ? JSON.parse(e.schedule) : '';
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

    $scope.printVoucher = function(){
      $window.print();
    }
}]);
