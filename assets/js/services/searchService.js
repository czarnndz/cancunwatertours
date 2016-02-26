/**
 * @ngdoc service
 * @name watertours.searchService
 * @description
 * # searchService
 * Service in the watertours.
 */
 (function(){

  angular.module('watertours')
    .service('searchService',['$rootScope' ,function ($rootScope) {
      this.params = {
        minFee: 0,
        maxFee: 0,
        category: {}
      };
      this.setParams = setParams;
      this.getParams = getParams;

      function setParams(params){
        if(params){
          this.params.minFee = params.minFee || this.params.minFee;
          this.params.maxFee = params.maxFee || this.params.maxFee;
          this.params.category = params.category || this.params.category;
          $rootScope.$emit('searchParamsChanged',this.params);
        }
      }
      function getParams(params){
        return this.params;
      }


    }]);


 })();
