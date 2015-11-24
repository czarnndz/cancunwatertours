app.controller('reservaCTL',function($scope,$filter,toursService,cartService) {
    $scope.city = '';
    $scope.client = window.client || {};
    $scope.client.isMobile = false;
    /*$scope.client = {
        isMobile : false
    };*/
    $scope.minDate = new Date();
    $scope.hotels = hotels;
    $scope.isDisabled = true;
    $scope.terminos = false;
    $scope.step = 0;

    $scope.tours = cartService.getAll();

    $scope.continueShopping = function() {
      location.href = "/";
    };

    $scope.continueClick = function(){
      if( !$scope.isNextButtonDisabled() ){
          if ($scope.step == 3) {
              cartService.process();
          } else  {
              $scope.step++;
          }
      }
    }

    $scope.isNextButtonDisabled = function() {
        //console.log('is disabled function');
        //console.log($scope.reserva);
        //console.log($scope.reserva.$valid);
        if ($scope.step == 0) {
            if (!$scope.terminos)
                return true;
            else
                return false;
        } else if ($scope.step == 1) {
            if ($scope.reserva.nombre.$invalid || $scope.reserva.apellido.$invalid || $scope.reserva.email.$invalid || ($scope.repeat_email != $scope.tour.client.email))
                return true;
            else
                return false;
        }
    };

    $scope.priceTour = function(tour) {
        return cartService.getPriceTour(tour);
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

});
