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
      serv.getPriceTourTax = getPriceTourTax;
      serv.getPriceTourWTax = getPriceTourWTax;
      serv.getPriceTourTransfer = getPriceTourTransfer;
      serv.getPriceTourTotal = getPriceTourTotal;
      serv.getPriceAdults = getPriceAdults;
      serv.getPriceKids = getPriceKids;
      serv.getPriceTotal = getPriceTotal;
      serv.getPriceTotalTax = getPriceTotalTax;
      serv.removeItem = removeItem;
      serv.process = process;
      serv.tax = 0.15;
      serv.get = get;
      serv.getAll = getAll;
      serv.flush = flush;
      serv.setHotel = setHotel;
      serv.getHotel = getHotel;
      $rootScope.cart_items = localStorageService.get('cart_items') || [];
      $rootScope.cart_client = localStorageService.get('cart_client') || {}  ;
      $rootScope.cart_client = localStorageService.get('cart_hotel') || {}  ;

      function setHotel() {
          return $rootScope.cart_hotel;
      }

      function getHotel(hotel) {
          $rootScope.cart_hotel = hotel;
      }

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

      //TODO cambiar a promises cuando tengamos api de cotizado
      function getPriceTour(tour,callback) {
          var exchangeRate = getExchangeRate();
          if (tour.priceType == 'group') {
              callback((tour.fee * exchangeRate));
          } else {
              if (tour.kids > 0) {
                  callback((tour.adults * tour.fee * exchangeRate) + (tour.kids * (tour.feeChild ? tour.feeChild : tour.fee) * exchangeRate));//si no hay precio de ninio agarra el de adulto
              } else {
                  callback((tour.adults * tour.fee * exchangeRate));
              }
          }
      }

      function getPriceTourWTax(tour,callback) {
          getPriceTour(tour,function(price){
              callback(price + (price * serv.tax));
          });
      }

      function getPriceTourTax(tour,callback) {
          getPriceTour(tour,function(price){
              callback(price * serv.tax);
          });
      }

      function getPriceTotalTax(transferPrices){
        var deferred = $q.defer();
        getPriceTotal(transferPrices).then(function(total){
            deferred.resolve(total * serv.tax);
        });
        return deferred.promise;
      }

      function getPriceTourTotal(tour,transferPrices) {
          var deferred = $q.defer();
          getPriceTourTransfer(tour,transferPrices).then(function(value) {
              //console.log(value);
              getPriceTour(tour,function(val) {
                  //console.log(val);
                  if (tour.hotel) {
                      deferred.resolve(val + value);
                  }
                  else {
                      deferred.resolve(val);
                  }
              });
          });

          return deferred.promise;
      }

      //TODO necesita cambios en caso de que los cart_items ya no sean todos de tour
      function getPriceTotal(transferPrices){
          var deferred = $q.defer();
          var functions = [];
          async.each($rootScope.cart_items,function(item,cb){
              var auxItem = angular.copy(item);
              functions.push(function(cb1){
                  getPriceTourTotal(auxItem,transferPrices).then(function(res){
                      //console.log(res);
                      cb1(false,res);
                  });
              });
              cb();
          },function(err){
            //console.log('total');
            async.parallel(functions,function(err,results){
                async.reduce(results,0,function(prev,i,callback){
                    callback(null,prev + i);
                },function(err,total) {
                    deferred.resolve(total);
                });
            });
          });
          return deferred.promise;
      }

      function getPriceAdults(tour,callback) {
        var auxTour = {
          fee : tour.fee,
          kids : 0,
          adults : tour.adults,
          priceType : tour.priceType
        };
        return getPriceTour(auxTour,callback);
      }

      function getPriceKids(tour,callback) {
        var auxTour = {
          fee : tour.fee,
          feeChild : tour.feeChild,
          kids : tour.kids,
          adults : 0,
          priceType : tour.priceType
        };
        return getPriceTour(auxTour,callback);
      }

      function process(client){

        var deferred = $q.defer();
        var items = getFormatedItems();
        var params = { items : items,currency : $rootScope.global_currency.id,client : $rootScope.cart_client };
        console.log(params);
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
            schedule : item.schedule,
            transfer_price : item.transfer_price,
            haveTransfer : item.haveTransfer,
            departurePoint : item.departurePoint
          };
          return aux;
        });
      }

      $rootScope.$watch('cart_hotel',function(){
          localStorageService.set('cart_hotel', $rootScope.cart_hotel);
      });

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

      function getPriceTourTransfer(tour,transferPrices) {
        var deferred = $q.defer();
        var exchangeRate = getExchangeRate();
        var found = false;
        if (tour.haveTransfer || (!tour.transfer)) {
            deferred.resolve(0);
        } else if (tour.hotel && transferPrices && transferPrices.length > 0) {
            angular.forEach(transferPrices,function(val){
                if ((val.zone1 == tour.hotel.zone && val.zone2 == tour.zone) || (val.zone2 == tour.hotel.zone && val.zone1 == tour.zone)) {
                    found = true;
                    var aux = 0;
                    if (val.transfer.service_type == 'C') {
                        var quantity = Math.ceil(((parseInt(tour.adults) + parseInt(tour.kids)) / val.transfer.max_pax)); //dpenede del tipo de transfer
                        console.log(quantity);
                        aux = quantity * parseFloat(val.round_trip) * exchangeRate;
                    } else {
                        if (tour.kids > 0) {
                            aux = (tour.adults * parseFloat(val.round_trip) * exchangeRate) + (tour.kids * (angular.isDefined(val['round_trip_child']) ? parseFloat(val.round_trip_child) : parseFloat(val.round_trip)) * exchangeRate);
                        } else {
                            aux = (tour.adults * parseFloat(val.round_trip) * exchangeRate);
                        }
                    }

                    //aux *= quantity;
                    deferred.resolve(aux);
                }
            });
            //console.log(found);
            if (!found)
                deferred.resolve(0);
        } else {
            deferred.resolve(0);
        }
        return deferred.promise;
      }

    });

})();
