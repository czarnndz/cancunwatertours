var app = angular.module('watertours',[
  'ngMaterial',
  'leaflet-directive',
  'slick',
  'perfect_scrollbar',
  'LocalStorageModule',
  'angularLazyImg'
  ]);

app.config(['localStorageServiceProvider','lazyImgConfigProvider', function(localStorageServiceProvider, lazyImgConfigProvider){
  localStorageServiceProvider.setPrefix('ls');

  lazyImgConfigProvider.setOptions({
    offset: 100, // how early you want to load image (default = 100)
    errorClass: 'error', // in case of loading image failure what class should be added (default = null)
    successClass: 'lazy-load-complete', // in case of loading image success what class should be added (default = null)
  });

}]);
