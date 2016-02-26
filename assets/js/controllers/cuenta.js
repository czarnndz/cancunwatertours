app.controller('Cuenta',[ '$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {

  $scope.init = function(){
    $scope.user = window.user;
    console.log($scope.user);
    if($scope.user.birthday){
      var birthday = new Date($scope.user.birthday);
      $scope.userBirthday = birthday.getDate();
      $scope.userBirthmonth = birthday.getMonth();
      $scope.userBirthyear = birthday.getFullYear();
    }
    $scope.userGender = $scope.user.gender;
  };

  var months_en = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var months_es = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  $scope.months = $rootScope.currentLang == 'es' ? months_es : months_en;

  $scope.getRange = function(min, max) {
    var arr = [];
    for (var i = min; i <= max; i ++) {
        arr.push(i);
    }
    return arr;
  };

  $scope.init();

}]);
