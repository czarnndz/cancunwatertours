/**
 * @ngdoc service
 * @name watertours.cartService
 * @description
 * # cartService
 * Service in the watertours.
 */
(function(){

  angular.module('watertours')
    .service('cartService',['$rootScope','$http','$q','localStorageService' ,function ($rootScope,$http,$q,localStorageService) {
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
      serv.getPercentageDiscount = getPercentageDiscount;
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
        var deferred = $q.defer();
        var params = {
          ids: []
        };
        $rootScope.cart_items.forEach(function(cartItem, index){
          params.ids[index] = cartItem.id;
        });

        $http({
            method : 'POST',
            url : '/get_tours_prices',
            data : params
        }).then(function(res){
            //Updating prices from DB
            if( angular.isArray(res.data) ){
              var auxArr = $rootScope.cart_items;
              var toursResponse = [];

              //Sorting by ids list
              params.ids.forEach(function(id){
                var tour = _.findWhere( res.data, {id: id} );
                if(tour){
                  toursResponse.push(tour);
                }
              });

              //TODO check if tour still exists in DB
              auxArr = auxArr.map(function(cartItem, index){
                cartItem.fee = toursResponse[index].fee;
                cartItem.feeChild = toursResponse[index].feeChild;
                //cartItem.extra_prices = toursResponse[index].extra_prices;
                return cartItem;
              });
              $rootScope.cart_items = auxArr;
              deferred.resolve($rootScope.cart_items);
            }
            else{
              deferred.resolve([]);
            }
        }, function(err){
            console.log(err);
            deferred.resolve([]);
        });

        return deferred.promise;
      }

      function removeItem(index) {
        $rootScope.cart_items.splice(index,1);
      }

      function flush(){
        $rootScope.cart_items.length = 0;
      }

      //TODO cambiar a promises cuando tengamos api de cotizado
      function getPriceTour(tour,callback, isGlobalDiscountActive) {
          var exchangeRate = getExchangeRate();
          var priceTour = 0;
          //console.log('comision: ' + tour.commission_agency + ' de tour :' + tour.name + ' aplicar descuento : ' + isGlobalDiscountActive);
          if (tour.priceType == 'group') {
              priceTour = tour.fee * exchangeRate;
          } else {
              if (tour.kids > 0) {
                priceTour =  (tour.adults * tour.fee * exchangeRate) + (tour.kids * (tour.feeChild ? tour.feeChild : tour.fee) * exchangeRate);//si no hay precio de ninio agarra el de adulto
              } else {
                priceTour = (tour.adults * tour.fee * exchangeRate);
              }
          }

          if(isGlobalDiscountActive){
            priceTour = calculateDiscount(priceTour, tour.commission_agency, tour.id);
          }

          callback(priceTour);
      }

      function calculateDiscount(price, commission, tourId){
        var result = price;
        var discPercent = getPercentageDiscount(commission);

        var exceptions = [
          '558dc7e368b4f41b1a39b75f', //Xcaret basico
          '547d015533b3bf00659e057d', //Xcaret Plus
        ];

        if( exceptions.indexOf(tourId) <= -1 ){
          if(discPercent > 0){
            result = price - ( price * (discPercent / 100) );
          }
          else if (commission && parseFloat(commission) > 40){
            discPercent = 25;
            result = price - ( price * (discPercent / 100) );
          }
        }
        return result;
      }

      function getPercentageDiscount(commission){
        var percentage = 0;
        var discountTable = {
          '10': 5,
          '15': 10,
          '20': 10,
          '25': 15,
          '30': 15,
          '35': 20,
          '40': 20,
          '45': 25,
          '50': 25
        };
        if(discountTable[commission]){
          percentage = discountTable[commission];
        }
        else if (commission && parseFloat(commission) > 40){
          percentage = 25;
        }
        return percentage;
      }

      function getPriceTourWTax(tour,callback) {
          getPriceTour(tour,function(price){
              callback(price + (price * serv.tax));
          });
      }

      function getPriceTourTax(tour,callback) {
          var isGlobalDiscountActive = true;
          getPriceTour(tour,function(price){
              callback(price * serv.tax);
          }, isGlobalDiscountActive);
      }

      function getPriceTotalTax(transferPrices){
        var deferred = $q.defer();
        getPriceTotal(transferPrices).then(function(total){
            deferred.resolve(total * serv.tax);
        });
        return deferred.promise;
      }

      function getPriceTourTotal(tour,transferPrices, isGlobalDiscountActive) {
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
              }, isGlobalDiscountActive);
          });

          return deferred.promise;
      }

      //TODO necesita cambios en caso de que los cart_items ya no sean todos de tour
      function getPriceTotal(transferPrices, isGlobalDiscountActive){
          //console.log('getPriceTotal : ' + isGlobalDiscountActive);
          var deferred = $q.defer();
          var functions = [];
          async.each($rootScope.cart_items,function(item,cb){
              var auxItem = angular.copy(item);
              functions.push(function(cb1){
                  getPriceTourTotal(auxItem,transferPrices, isGlobalDiscountActive).then(function(res){
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
                if (params.client.phone_lada)
                  params.client.phone = params.client.phone + params.client.phone_lada;
                $http({
                    method : 'POST',
                    url : '/process',
                    data : params
                }).then(function(res){
                    deferred.resolve(res);
                });

            },function(e) { //error
                console.log(e);
                deferred.reject(e);
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
            //transfer : item.transfer,
            hotel : item.hotel,
            schedule : item.schedule,
            transfer_price : item.transfer_price,
            //haveTransfer : item.haveTransfer,
            haveTransfer: false,
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


      serv.isPierTax = function(tour) {
        if (!tour || !tour.noincludes)
          return false;

        return tour.noincludes.filter(serv.isPierTaxMatch).length;
      };

      serv.hasPierTax = function(tours) {
        console.log('has...');
        if (!tours || !tours.length)
          return false;
        return tours.filter(serv.isPierTax).length;
      };

      serv.isPierTaxMatch = function(el) {
        return el.match(/(pier|dock|muelle)/ig);
      };

    }]);

})();
