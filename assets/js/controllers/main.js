app.controller('MainCTL', function($scope, $window, $http, $rootScope, $mdDialog, toursService, searchService,cartService,localStorageService) {
    //$scope.tours = [];
    $scope.cartService = cartService;
    $scope.maxFee = 0;
    $scope.minFee = 10000;
    $scope.toursCategories = [];
    $scope.mainCategories = [];
    $scope.registerToggle = false;
    $scope.loginToggle = false;
    $scope.contact = {};
    $rootScope.currentLang = $window.currentLang;

    $scope.currencyList = currencies;

    $rootScope.global_exchange_rates = exchange_rates;
    $rootScope.global_base_currency = base_currency;
    $rootScope.global_currency = localStorageService.get('global_currency') || base_currency;
    $rootScope.global_lang = localStorageService.get('global_lang') || {label: 'Español',value: 'es'};

    $scope.langList = [
      {label: 'Español',value: 'es'},
      {label: 'English',value: 'en'}
    ];

    $scope.lang = $scope.langList[0];
    $scope.currency = $scope.currencyList[0];

    $scope.setCurrency = function(val){
      $rootScope.global_currency = val;
    };

    $scope.setLang = function(val){
      $scope.global_lang = val;
    };

    $rootScope.$watch('global_currency',function(){
      localStorageService.set('global_currency', $rootScope.global_currency);
    });


    $scope.doLoginToggle = function($event){
      //$event.stopPropagation($event);
      if($scope.registerToggle){
        $scope.registerToggle = false;
      }
      $scope.loginToggle = !$scope.loginToggle;
      if($scope.loginToggle){
        $scope.scrollTop();
      }
    };

    $scope.doRegisterToggle = function($event){
      //$event.stopPropagation();
      if($scope.loginToggle){
        $scope.loginToggle = false;
      }
      $scope.registerToggle = !$scope.registerToggle;
      if($scope.registerToggle){
        $scope.scrollTop();
      }
    };

    $scope.scrollTop = function(){
      setTimeout(
          function(){
            $('html, body').animate({
              scrollTop: 0
            }, 250);
          },
          300
      );
    };

    $scope.getFeeRange = function(){
        toursService.getFeeRange().then(function(res){
            $scope.minFee = res.minFee;
            $scope.maxFee = res.maxFee;
        });
    };

    $scope.getToursCategories = function() {
      toursService.getCategories().then(function(res){
        //console.log(res);
        $scope.toursCategories = res;
      });
    };

    $scope.doSearch = function(){
      var params = {
        minFee: $scope.minFee,
        maxFee: $scope.maxFee,
        category: $scope.tourCategory
      };
      searchService.setParams(params);
    };

    $scope.doContact = function($event, form){
      var optionsSuccess = {
        title: 'Mensaje enviado',
        message: 'Gracias por enviar tu mensaje'
      };
      var optionsFail = {
        title: 'Revisa tu información',
        message: 'Revisa la información e intenta de nuevo'
      };

      if(form.$valid){
        var params = {
          contactName: $scope.contact.name,
          contactEmail: $scope.contact.email,
          contactMessage: $scope.contact.message
        }

        $http({
          method : 'POST',
          url : '/contact/send',
          data : params
        }).then(function(res){
          console.log(res);
          if(res && res.data){
            if(res.data.m === 's'){
              $scope.showAlert($event, optionsSuccess);
            }else{
              $scope.showAlert($event, optionsFail);
            }
          }else{
            $scope.showAlert($event, optionsFail);
          }
        });
      }else{
        $scope.showAlert($event, optionsFail);
      }
    }

    $scope.showAlert = function(ev, options) {
      var title = options.title || 'Titulo';
      var message = options.message || 'Aceptar';
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#main')))
          .clickOutsideToClose(true)
          .title(title)
          .content(message)
          //.textContent('You can specify some description text in here.')
          .ariaLabel('Alert Dialog Demo')
          .ok('Cerrar')
          .targetEvent(ev)
      );
    };

    $scope.init = function(){
        $scope.getToursCategories();
        $scope.getFeeRange();
    };

    $scope.init();

});
