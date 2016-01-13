app.controller('reservaCTL',function($scope,$filter,toursService,cartService,$location,$rootScope) {
    $scope.cartService = cartService;
    $scope.city = '';
    $scope.client = window.client || {name:'',last_name:'',email:''};
    $scope.client.isMobile = false;
    if (!cartService.getClient().name) {
      cartService.setClient($scope.client);
    }
    /*$scope.client = {
        isMobile : false
    };*/

    $scope.minDate = new Date();
    $scope.hotels = hotels;
    $scope.isDisabled = true;
    $scope.terminos = false;
    $scope.step = 0;

    $scope.tours = cartService.getAll();
    console.log($scope.tours);

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
    }

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

    window.onbeforeunload = function (event) {
      var message = 'Sure you want to leave?';
      if (typeof event == 'undefined') {
        event = window.event;
      }
      if (event) {
        event.returnValue = message;
      }
      return message;
    }

    $scope.isNextButtonDisabled = function($event) {
        if ($scope.step == 0) {
          for(var i = 0;i<$scope.tours.length;i++) {
            if ($scope.tours[i].transfer && !$scope.tours[i].hotel) {
              console.log('no hotel selected');
              return true;
            }
          }
          return false;
        } else if ($scope.step == 1) {
            $scope.validatingClient = true;
            if ($scope.client.name.$invalid || $scope.client.last_name.$invalid || $scope.client.email.$invalid || ($scope.repeat_email != $scope.client.email) ){
              console.log('disabled');
              var options = {
                title: 'Revisa tu información',
                message: 'Revisa la información e intenta de nuevo'
              };
              $scope.showAlert($event, options);
              return true;
            }
            else{
              console.log('not disabled');
              return false;
            }
        }
    };

    $scope.priceTour = function(tour) {
        return cartService.getPriceTourOnly(tour);
    };

    $scope.removeTour = function(index) {
        cartService.removeItem(index);
        $scope.tours = cartService.getAll();
    }

    $scope.priceTotal = function(){
        return cartService.getPriceTotalTotal();
    }

    $scope.tourPriceTotal = function(tour){
        return $scope.priceTour(tour) * $scope.priceTax(tour);
    }

    $scope.priceTax = function(tour){
      return cartService.getPriceTax(tour);
    }

    $scope.priceTransfer = function(tour) {
      return cartService.getPriceTransfer(tour,{ cost : 20 });
    }

    //TODO formatear para enviar los items formateados.
    $scope.process = function($event, form) {
      $scope.validatingPayment = true;
      if(form.$valid){
        console.log('valido');
        cartService.process($scope.client).then(function(result){
          console.log(result);
          if (result.data.success) {
            console.log('success');
            if (result.data.redirect_url)
                window.location.href = result.data.redirect_url;
            else
                console.log(result.data);
          } else {
            alert(result.data.success);
          }
        });

      }else{
        console.log('invalido');
        var options = {
          title: 'Revisa tu información',
          message: 'Revisa la información e intenta de nuevo'
        };
        $scope.showAlert($event, options);
      }
    }
});

app.controller('voucherCTL',function($scope,cartService) {
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

  console.log(theorder);



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
        e.feeChild = e.feeKids;
        e.adults = e.pax;
        e.kids = e.kidPax;
        e.schedule = JSON.parse(e.schedule);
        e.total = cartService.getPriceTour(e);
        e.tour.includesList = formatList(e.tour.includes_es);
        e.tour.notIncludesList = formatList(e.tour.does_not_include_es);
        $scope.total_reservations += e.total;
        console.log(e);
    });
});
