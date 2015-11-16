/**
 * @ngdoc service
 * @name watertours.toursService
 * @description
 * # toursService
 * Service in the watertours.
 */
 (function(){

  angular.module('watertours')
    .service('toursService', function ($http ,$q) {
      var serv = this;

      serv.getCategories = getCategories;
      serv.getTours = getTours;
      serv.getFeeRange = getFeeRange;
      serv.tours = [];
      serv.categories = [];

      function getTours(category,minFee,maxFee,term){
        var params = {};
        if (category) {
          params.category = category;
        }
        if (minFee) {
          params.minFee = minFee;
        }
        if (maxFee) {
          params.maxFee = maxFee;
        }
        if (term) {
          params.term = term;
        }

        return $http({
          method: 'GET',
          url: '/tours',
          params : params
        })
        .then(function(res){
          if (res.data && angular.isArray(res.data) ) {
            serv.tours = res.data;
            return res.data;
          }
          return [];
        })
        .catch(function(err){
          return [];
        });
      }

      function getCategories(name){
        return $http({
          method: 'GET',
          url: '/tour_categories'
        })
        .then(function(res){
          if (res.data && res.data.categories) {
            serv.categories = res.data.categories;
            return res.data.categories;
          }
          return [];
        })
        .catch(function(err){
          console.log(err);
          return [];
        });
      }

      function getFeeRange(){
        var maxFee = 0;
        var minFee = 10000;
        var range = {};
        var deferred = $q.defer();

        var calculateRange = function(tours){
          tours.forEach(function(item) {
              if (item.fee > maxFee) {
                  maxFee = item.fee;
              }
              if (item.fee < minFee) {
                  minFee = item.fee
              }
          });
          range = {
            minFee: minFee,
            maxFee: maxFee
          };
          deferred.resolve(range);
        }

        if(serv.tours.length > 0){
          calculateRange(serv.tours);
        }else{
          serv.getTours().then(function(tours){
            calculateRange(tours);
          });
        }

        return deferred.promise;

      }

  });

})();
