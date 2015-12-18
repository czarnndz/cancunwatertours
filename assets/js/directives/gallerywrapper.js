'use strict';

/**
 * @ngdoc directive
 * @name spaceshiplabsApp.directive:galleryWrapper
 * @description
 * # galleryWrapper
 */
 angular.module('watertours')
 .directive('galleryWrapper', function($window){

 	return function (scope, element) {// jshint ignore:line
 		var bookingForm = angular.element('.booking-partial-wrap');
    var w = angular.element($window);

 		scope.getBookingDimensions = function () {
 			return bookingForm.outerHeight(false);
 		};

 		scope.$watch(scope.getBookingDimensions, function (newValue, oldValue) {// jshint ignore:line
      var headerH = $(".tour-data").outerHeight(false);
      var newHeight = newValue - headerH;

      element.css({"height" : newHeight+"px"});

 		}, true);

 		w.bind('resize', function () {
 			scope.$digest();
 		});
 	};

 });
