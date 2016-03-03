'use strict';

/**
 * @ngdoc directive
 * @name spaceshiplabsApp.directive:fullScreenWrapper
 * @description
 * # fullScreenWrapper
 */
 angular.module('watertours')
 .directive('fullScreenWrapper',['$window', function($window){

 	function link(scope, element) {// jshint ignore:line
 		var w = angular.element($window);

 		scope.getWindowDimensions = function () {
 			return { 'h': w.outerHeight(false), 'w': w.width() };
 		};

 		scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {// jshint ignore:line
      var headerd = $(".header-desktop").outerHeight(false);
      var headerm = $(".header-mobile").outerHeight(false);
      var footer = $("#footer").outerHeight(false);

      var newHeight = newValue.h - headerm - footer;
      if(newValue.w >= 600){
        newHeight = newValue.h - headerd - footer;
      }

      element.css({"height" : newHeight+"px","min-height" : "526px"});

      scope.newWidth = function (){
        var side = 0;
        if($(".main-sidebar").length > 0){
          var sidebar = $(".main-sidebar");
          if(element[0].id == "home-photos"){
            element.css({'height':sidebar.outerHeight(false)});
          }
          side = $(".main-sidebar")[0].clientWidth;
        }

        return {"width" : (newValue.w-side)+"px"};
      }
 		}, true);

 		w.bind('resize', function () {
 			scope.$digest();
 		});
 	}

  return{
    link: link,
  }

 }]);
