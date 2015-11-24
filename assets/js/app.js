var app = angular.module('watertours',['ngMaterial','leaflet-directive','slick','perfect_scrollbar','LocalStorageModule']);

app.config(['localStorageServiceProvider', function(localStorageServiceProvider){
  localStorageServiceProvider.setPrefix('ls');
}]);
