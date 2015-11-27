app.controller('MainCTL', function($scope,$http, $rootScope, toursService, searchService,cartService) {
    //$scope.tours = [];
    $scope.maxFee = 0;
    $scope.minFee = 10000;
    $scope.toursCategories = [];
    $scope.mainCategories = [];
    $scope.registerToggle = false;
    $scope.loginToggle = false;

    $scope.doLoginToggle = function($event){
      //$event.stopPropagation($event);
      if($scope.registerToggle){
        $scope.registerToggle = false;
      }
      $scope.loginToggle = !$scope.loginToggle;
    };

    $scope.doRegisterToggle = function($event){
      //$event.stopPropagation();
      if($scope.loginToggle){
        $scope.loginToggle = false;
      }
      $scope.registerToggle = !$scope.registerToggle;
    };

    $scope.getFeeRange = function(){
        toursService.getFeeRange().then(function(res){
            $scope.minFee = res.minFee;
            $scope.maxFee = res.maxFee;
        });
    };

    $scope.getToursCategories = function() {
      toursService.getCategories().then(function(res){
        //console.log(res);
        $scope.toursCategories = res;
      });
    };

    $scope.doSearch = function(){
      var params = {
        minFee: $scope.minFee,
        maxFee: $scope.maxFee,
        category: $scope.tourCategory
      };
      searchService.setParams(params);
    };

    $scope.init = function(){
        $scope.getToursCategories();
        $scope.getFeeRange();
    };

    $scope.init();

    /*
    $(document).bind('click', function(event){
        var modals = [];
        modals.push($('#register-modal'));
        modals.push($('#login-modal'));

        for(var i=0;i<modals.length;i++){
          //isClickedElementChildOfPopup
          if(modals[i].find(event.target).length > 0){
            return;
          }
        }

        $scope.$apply(function(){
          $scope.registerToggle = false;
          $scope.loginToggle = false;
        });

    });*/

});
