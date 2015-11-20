app.controller('MainCTL', function($scope,$http, $rootScope, toursService, searchService,cartService) {
    //$scope.tours = [];
    $scope.maxFee = 0;
    $scope.minFee = 10000;
    $scope.toursCategories = [];
    $scope.registerToggle = false;
    $scope.loginToggle = false;

    $scope.doLoginToggle = function(){
      console.log('hey listen');
      if($scope.registerToggle){
        $scope.registerToggle = false;
      }
      $scope.loginToggle = !$scope.loginToggle;
    };

    $scope.doRegisterToggle = function(){
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
        $scope.toursCategories = res;
      });
    };

    $scope.querySearch = function(text) {
        var tours = [];
        if (angular.isArray($scope.tours)) {
            angular.forEach($scope.tours,function(item) {
                if (item.name.contains(text));
                    this.push(item);
            },tours);

        }
        return tours;
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


});
