/**
 * @ngdoc service
 * @name watertours.cartService
 * @description
 * # cartService
 * Service in the watertours.
 */
(function(){

  angular.module('watertours')
    .service('cartService', function ($rootScope,$http,$q,localStorageService) {
      var serv = this;

      serv.addTour = addTour;
      serv.getPriceTour = getPriceTour;
      serv.getPriceTax = getPriceTax;
      serv.getPriceTotalTotal = getPriceTotalTotal;
      serv.getPriceTotalTax = getPriceTotalTax;
      serv.getPriceTransfer = getPriceTransfer;
      serv.removeItem = removeItem;
      serv.process = process;
      serv.tax = 0.15;
      serv.get = get;
      serv.getAll = getAll;
      serv.flush = flush;
      $rootScope.cart_items = localStorageService.get('cart_items') || [];

      function get(index){
        return $rootScope.cart_items[index];
      }

      function addTour(item){
        $rootScope.cart_items.push(item);
      }

      function getAll(){
        return $rootScope.cart_items;
      }

      function removeItem(index) {
        $rootScope.cart_items.splice(index,1);
      }

      function flush(){
        $rootScope.cart_items.length = 0;
      }

      function getPriceTour(tour) {
        var transferPrice = getPriceTransfer(tour,{ cost : 20 })
        if (tour.kids > 0) {
          return transferPrice + (tour.adults * tour.fee) + (tour.kids * tour.feeChild);
        } else {
          return transferPrice + (tour.adults * tour.fee);
        }
      }

      function getPriceTotalTax(){
        var tax = getPriceTotal() * serv.tax;
        return tax;
      }

      function getPriceTax(tour){
        return getPriceTour(tour) * serv.tax;
      }

      function getPriceTotalTotal() {
        return getPriceTotal() + getPriceTotalTax();
      }

      function getPriceTotal(){
        return $rootScope.cart_items.reduce(function(prev,cur){
          return prev + getPriceTour(cur);
        },0);
      }

      function getPriceTransfer(tour,transfer){
        if (tour.hotel)
          return ((transfer.cost * tour.adults) + (tour.kids * transfer.cost));
        else
          return 0;
      };

      function process(){
        var response = {};
        var deferred = $q.defer();

        deferred.resolve(response);

        return deferred.promise;
      }

      $rootScope.$watch('cart_items', function () {
        //console.log($rootScope.cart_items);
        localStorageService.set('cart_items', $rootScope.cart_items);
      }, true);
    });

})();
