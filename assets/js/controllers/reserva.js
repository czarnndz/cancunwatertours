app.controller('reservaCTL',function($scope,$filter,toursService,cartService) {
    $scope.city = '';
    $scope.client = window.client || {name:'',last_name:'',email:''};
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

    //Fix md-datepicker
    for(var i=0;i<$scope.tours.length;i++){
      $scope.tours[i].date = new Date($scope.tours[i].date);
    }

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
        if ($scope.step == 0) {
            return false;
            /*if (!$scope.terminos)
                return true;
            else
                return false;*/
        } else if ($scope.step == 1) {

            if ($scope.client.name.$invalid || $scope.client.last_name.$invalid || $scope.client.email.$invalid || ($scope.repeat_email != $scope.client.email)){
              console.log('disabled');
                return true;
            }
            else{
              console.log('not disabled');
                return false;
            }
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
