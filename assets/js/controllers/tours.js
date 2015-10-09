

app.controller('tourCTL',function($scope,$http,ngCart){
    $scope.similar_tours = similar_tours;
    $scope.tour = tour;
    $scope.tour.adults = 1;
    $scope.tour.kids = 0;
    $scope.tour.date = new Date();
    $scope.minDate = new Date();
    $scope.hotels = [];

    console.log($scope.tour.description);

    $http.get('/hotels').success(function(response) {
        console.log(response);
        $scope.hotels = response;
    });

    $scope.getPrice = function(){
        if ($scope.kids > 0) {
            return ($scope.tour.adults * $scope.tour.fee) + ($scope.tour.kids * $scope.tour.feeChild);
        } else {
            return ($scope.tour.adults * $scope.tour.fee);
        }
    }
});

app.controller('CarouselDemoCtrl', function ($scope) {
  $scope.myInterval = 5000;
  var slides = $scope.slides = [];
});