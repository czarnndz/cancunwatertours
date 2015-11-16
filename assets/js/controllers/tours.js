

app.controller('tourCTL',function($scope,$http){
    $scope.similar_tours = similar_tours;
    $scope.imgs_url = imgs_url;
    $scope.tour = tour;
    $scope.tour.adults = 1;
    $scope.tour.kids = 0;
    $scope.tour.date = new Date();
    $scope.minDate = new Date();
    $scope.hotels = [];

    console.log($scope.similar_tours);
    console.log($scope.tour.description);

    $http.get('/hotels').success(function(response) {
        console.log(response);
        $scope.hotels = response;
    });

    $scope.setUpGallery = function(){
      $scope.galleryPhotos = $scope.tour.files.map(function(file){
        return $scope.imgs_url + '/uploads/tours/gallery/593x331' +  file.filename;
      });
    }

    $scope.getPrice = function(){
        if ($scope.kids > 0) {
            return ($scope.tour.adults * $scope.tour.fee) + ($scope.tour.kids * $scope.tour.feeChild);
        } else {
            return ($scope.tour.adults * $scope.tour.fee);
        }
    }

    $scope.setUpGallery();
});

app.controller('CarouselDemoCtrl', function ($scope) {
  $scope.myInterval = 5000;
  var slides = $scope.slides = [];
});
