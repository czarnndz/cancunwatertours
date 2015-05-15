var app = angular.module('water-tours',['ngMaterial']) 

 app.controller('HeaderCtrl', function ($scope) {
  $scope.posts = [
   {
         title:'Tour',
   },
   {
         title:'Hotel',
   },
    {
         title:'Aventura',
   },
    ];

});