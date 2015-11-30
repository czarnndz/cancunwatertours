'use strict';

/**
 * @ngdoc directive
 * @name spaceshiplabsApp.directive:fullScreenWrapper
 * @description
 * # fullScreenWrapper
 */
 angular.module('watertours')
 .directive('fullScreenWrapper', function($window){

 	return function (scope, element) {// jshint ignore:line
 		var w = angular.element($window);

 		scope.getWindowDimensions = function () {
 			return { 'h': w.height(), 'w': w.width() };
 		};

 		scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {// jshint ignore:line
      var headerd = $(".header-desktop")[0].clientHeight;
      var headerm = $(".header-mobile")[0].clientHeight;
      var footer = $("#footer")[0].clientHeight;

      var newHeight = newValue.h - headerm - footer;
      if(newValue.w >= 600){
        newHeight = newValue.h - headerd - footer;
      }

      element.css({"height" : newHeight+"px","min-height" : "526px"});

      scope.newWidth = function (){
        var side = 0;
        if($(".main-sidebar").length > 0){
          side = $(".main-sidebar")[0].clientWidth;
        }

        return {"width" : (newValue.w-side)+"px"};
      }
 		}, true);

 		w.bind('resize', function () {
 			scope.$digest();
 		});
 	};

 });
