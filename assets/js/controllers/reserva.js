app.controller('reservaCTL',function($scope,$filter) {
    $scope.city = '';
    //$rootScope.orderID = false;
    $scope.tour = tour;
    $scope.tour.adults = 1;
    $scope.tour.kids = 0;
    $scope.tour.date = new Date();
    $scope.tour.client = {
        isMobile : false
    };
    $scope.minDate = new Date();
    $scope.hotel = hotel;
    $scope.hotels = hotels;
    $scope.isDisabled = true;
    $scope.terminos = false;
    $scope.step = 0;
    $scope.transportation = {
        cost : 20
    };

    var aux_schedules = [];
    $scope.tour.schedules.forEach(function(el) {
        aux_schedules.push(JSON.parse(el));
    });

    $scope.tour.schedules = aux_schedules;

    $scope.addCart = function() {

    }

    $scope.continueClick = function(){
        if ($scope.step == 3) {
            $scope.addCart();
        } else  {
            $scope.step++;
        }
    }

    $scope.isNextButtonDisabled = function() {
        console.log('is disabled function');
        console.log($scope.reserva);
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

    $scope.priceTour = function() {
        var total = tour.fee * tour.adults;
        if (tour.kids) {
            total += tour.feeChild * tour.kids;
        }
        return total;
    };

    $scope.priceTax = function(){
        var tax = $scope.price() * 0.15;
        return tax;
    };

    $scope.priceTotal = function() {
        var total = $scope.price() * 1.15;
        return total;
    };

    $scope.price = function() {
        return ($scope.priceTour() + $scope.priceTransfer());
    }

    $scope.priceTransfer = function(){
        if ($scope.hotel)
            return (($scope.transportation.cost * $scope.tour.adults) + ($scope.tour.kids * $scope.transportation.cost));
        else
            return 0;
    };

});