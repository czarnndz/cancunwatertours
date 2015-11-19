/**
 * @ngdoc service
 * @name watertours.cartService
 * @description
 * # cartService
 * Service in the watertours.
 */
(function(){

  angular.module('watertours')
    .service('cartService', function ($rootScope,localStorageService) {
      var serv = this;

      serv.setItem = setItem;
      serv.getItem = getItem;
      serv.getItems = getItems;
      serv.flush = flush;
      serv.cart_items = localStorageService.get('cart_items') || [];

      function getItem(index){
        return serv.cart_items[index];
      }

      function setItem(item){
        serv.cart_items.push(item);
      }

      function getItems(){
        return serv.cart_items;
      }

      function removeItem(index) {
        serv.cart_items.splice(index,1);
      }

      function flush(){
        serv.cart_items.length = 0;
      }

      $rootScope.$watch('cart_items', function () {
        console.log(serv.cart_items);
        localStorageService.set('cart_items', serv.cart_items);
      }, true);
    });

})();
