/**
 * @ngdoc service
 * @name watertours.toursService
 * @description
 * # toursService
 * Service in the watertours.
 */
 (function(){

  angular.module('watertours')
    .service('toursService', function ($http) {

      this.getCategories = getCategories;

      function getCategories(name){
        return $http({
          method: 'GET',
          url: '/tour_categories',
        })
        .then(getCategoriesComplete)
        .catch(getCategoriesFailed);

        function getCategoriesComplete(res){
          console.log(res);
          if (res.data && res.data.categories) {
            return res.data.categories;
          }
          return [];
        }

        function getCategoriesFailed(err){
          console.log(err);
        }
      }

    });


 })();
