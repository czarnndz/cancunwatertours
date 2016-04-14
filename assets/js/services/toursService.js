/**
 * @ngdoc service
 * @name watertours.toursService
 * @description
 * # toursService
 * Service in the watertours.
 */
 (function(){

  angular.module('watertours')
    .service('toursService',[ '$http' ,'$q', '$rootScope', function ($http ,$q, $rootScope) {
      var serv = this;

      serv.currentLang = $rootScope.currentLang;
      serv.getCategories = getCategories;
      serv.getTours = getTours;
      serv.getToursById = getToursById;
      serv.getFeeRange = getFeeRange;
      serv.getCategoryIcon = getCategoryIcon;
      serv.getMainCategories = getMainCategories;
      serv.getToursByName = getToursByName;
      serv.tours = [];
      serv.categories = [];

      function getTours(category,minFee,maxFee,term,all,lang){
        var params = {};
        var deferred = $q.defer();
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
        if (all) {
            params.all = all;
        }
        if (lang) {
            params.lang = lang;
        }

        $http.get('/tour_list', {
              params: params
          })
        .success(function(data,status){
          if (data && angular.isArray(data) ) {
            serv.tours = data;
            deferred.resolve(data);
          } else
            deferred.resolve([]);
        });

        return deferred.promise;
      }


      function getToursById(ids){
        var params = {};
        var deferred = $q.defer();
        if(ids){
          params.idslist = ids;
        }

        $http.get('/tour_list', {
              params: params
          })
        .success(function(data,status){
          if (data && angular.isArray(data) ) {
            //serv.tours = data;
            deferred.resolve(data);
          } else
            deferred.resolve([]);
        });

        return deferred.promise;
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

      function getFeeRange(tours){
        var maxFee = 0;
        var minFee = 100000;
        var range = {};
        var deferred = $q.defer();

        var calculateRange = function(tours){
          tours.forEach(function(item) {
              if (item.total_price > maxFee) {
                  maxFee = item.total_price;
              }
              if (item.total_price < minFee) {
                  minFee = item.total_price;
              }
          });
          range = {
            minFee: minFee,
            maxFee: maxFee
          };

          deferred.resolve(range);
        };

        calculateRange(tours);
        return deferred.promise;
      }

      function getToursByName(name){
        return $http({
          method: 'GET',
          url: '/tours_search',
          params: {
            term: name,
            lang : $rootScope.currentLang
          }
        })
        .then(getToursByNameComplete)
        .catch(getToursByNameFail);

        function getToursByNameComplete(res){
          if (res.data) {
            return res.data;
          }
          return [];
        }

        function getToursByNameFail(err){
          console.log(err);
        }
      }

      var iconsObj = [
          { name : 'Sitios arqueológicos',  icon :'archaeological-sites' },
          { name : 'Paseos en barco',       icon :'viajes' },
          { name : 'Buceo',                 icon :'diving' },
          { name : 'Snorkel',               icon :'snorkeling' },
          { name : 'Pesca',                 icon :'fishing' },
          { name : 'Aventura',              icon :'adventure' },
          { name : 'Parques temáticos',     icon :'theme-parks' },
          { name : 'Cenotes',               icon :'cenote' },
          { name : 'Deportes acuáticos',    icon :'water-sports' },
          { name : 'Familiar',              icon :'familiar2'},
          { name : 'Parejas',               icon :'parejas'},
          { name : 'Grupos',                icon :'grupos'},
          { name : 'Embarazadas',           icon :'embarazadas'},
          { name : 'Naturaleza',            icon :'naturaleza'},
          { name : 'Bebes',                 icon :'bebes'},
          { name : 'Cultural',              icon :'cultural'},
          { name : 'Nocturno',              icon :'nocturno'},
          { name : 'Nivel de Agua',         icon :'mojado' },
          { name : 'Actividad Física',      icon :'actividad' },
          { name : 'Accesible',             icon :'accesible'},
          { name : 'Bebes',                 icon :'bebes'},


        ];
      function getCategoryIcon(category){
        var icon = '';
        for(var x in iconsObj){
          if( iconsObj[x].name == category.name ){
            icon = iconsObj[x].icon;
          }
        }
        if(icon === ''){
          icon = 'todos';
        }
        return icon;
      }

      function getMainCategories(categories){
        var mainCategories = categories.filter(function(category){
          if(category.principal){
            return true;
          }
        });
        return mainCategories;
      }
  }]);

})();
