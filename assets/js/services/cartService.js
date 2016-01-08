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
      serv.getClient = getClient;
      serv.setClient = setClient;
      serv.getPriceTour = getPriceTour;
      serv.getPriceTourOnly = getPriceTourOnly;
      serv.getPriceTax = getPriceTax;
      serv.getPriceTotalTotal = getPriceTotalTotal;
      serv.getPriceTotalTax = getPriceTotalTax;
      serv.getPriceTransfer = getPriceTransfer;
      serv.getPriceAdults = getPriceAdults;
      serv.getPriceKids = getPriceKids;
      serv.removeItem = removeItem;
      serv.process = process;
      serv.tax = 0.15;
      serv.get = get;
      serv.getAll = getAll;
      serv.flush = flush;
      $rootScope.cart_items = localStorageService.get('cart_items') || [];
      $rootScope.cart_client = localStorageService.get('cart_client') || {}  ;

      function getClient() {
        return $rootScope.cart_client;
      }

      function setClient(client) {
        $rootScope.cart_client = client;
      }

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
        var exchangeRate = getExchangeRate();
        var transferPrice = getPriceTransfer(tour,{ cost : 20 });
        if (tour.kids > 0) {
          return transferPrice + (tour.adults * tour.fee * exchangeRate) + (tour.kids * (tour.feeChild ? tour.feeChild : tour.fee) * exchangeRate);
        } else {
          return transferPrice + (tour.adults * tour.fee * exchangeRate);
        }
      }

      function getPriceTourOnly(tour) {
          var exchangeRate = getExchangeRate();
          if (tour.kids > 0) {
              return (tour.adults * tour.fee * exchangeRate) + (tour.kids * (tour.feeChild ? tour.feeChild : tour.fee) * exchangeRate);
          } else {
              return (tour.adults * tour.fee * exchangeRate);
          }
      }

      function getPriceTotalTax(){
        return (getPriceTotal() * serv.tax);

      }

      function getPriceTax(tour){
        return getPriceTour(tour) * serv.tax;
      }

      function getPriceTotalTotal() {
        return getPriceTotal();
      }

      function getPriceTotal(){
        return $rootScope.cart_items.reduce(function(prev,cur){
          return prev + getPriceTour(cur);
        },0);
      }

      function getPriceTransfer(tour,transfer){
        var exchangeRate = getExchangeRate();
        if (tour.hotel && tour.transfer)
          return ((transfer.cost * tour.adults * exchangeRate) + (tour.kids * transfer.cost * exchangeRate));
        else
          return 0;
      };

      function getPriceAdults(tour) {
        var auxTour = {
          fee : tour.fee,
          kids : 0,
          adults : tour.adults
        };
        return getPriceTour(auxTour);
      }

      function getPriceKids(tour) {
        var auxTour = {
          fee : tour.fee,
          kids : tour.kids,
          adults : 0
        };
        return getPriceTour(auxTour);
      }

      function process(client){

        var deferred = $q.defer();
        var items = getFormatedItems();
        var params = { items : items,currency : $rootScope.global_currency.id,client : $rootScope.cart_client };

        if (client)
            $rootScope.cart_client = client;
        if ($rootScope.cart_client.payment_method != 'paypal') {
            Conekta.token.create({ card : {
                number: $rootScope.cart_client.cc.number,//"4242424242424242",
                name: $rootScope.cart_client.cc.name,
                exp_year: $rootScope.cart_client.cc.year,
                exp_month: $rootScope.cart_client.cc.month,
                cvc: $rootScope.cart_client.cc.code
                }
            },function(e){ //success
                console.log(e);
                //delete params.client.cc;
                params.token = e.id;
                params.client.payment_method = 'conekta';
                $http({
                    method : 'POST',
                    url : '/process',
                    data : params
                }).then(function(res){
                    deferred.resolve(res);
                });

            },function(e) { //error
                console.log(e);
            });
        } else {
            $http({
                method : 'POST',
                url : '/process',
                data : params
            }).then(function(res){
                deferred.resolve(res);
            });
        }
        return deferred.promise;

      }

      function getFormatedItems(){
        return $rootScope.cart_items.map(function(item) {
          var aux = {
            id : item.id,
            date : item.date,
            adults : item.adults,
            kids : item.kids,
            transfer : item.transfer,
            hotel : item.hotel,
            schedule : item.schedule
          };
          return aux;
        });
      }

      $rootScope.$watch('cart_items', function () {
        //console.log($rootScope.cart_items);
        localStorageService.set('cart_items', $rootScope.cart_items);
      }, true);

      $rootScope.$watch('cart_client', function () {
        //console.log($rootScope.cart_items);
        localStorageService.set('cart_client', $rootScope.cart_client);
      });

      function getExchangeRate() {
        if ($rootScope.global_currency.currency_code == $rootScope.global_base_currency.currency_code) {
          return 1;
        } else {
          return $rootScope.global_exchange_rates[$rootScope.global_currency.id].sales;
        }
      }
    });

})();
