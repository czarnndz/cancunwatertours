app.controller('MainCTL',[ '$scope', '$window', '$http', '$rootScope', '$mdDialog', '$timeout', 'toursService', 'searchService','cartService','localStorageService' ,function($scope, $window, $http, $rootScope, $mdDialog, $timeout, toursService, searchService,cartService,localStorageService) {
    //$scope.tours = [];
    $scope.cartService = cartService;
    $scope.maxFee = 0;
    $scope.minFee = 10000;
    $scope.toursCategories = [];
    $scope.mainCategories = [];
    $scope.registerToggle = false;
    $scope.loginToggle = false;
    $scope.contact = {};
    $scope.isGlobalDiscountActive = window.isGlobalDiscountActive;

    $scope.langList = [
      {label: 'Español',value: 'es'},
      {label: 'English',value: 'en'}
    ];

    $scope.initLang = function(key){
      var lang = {label: 'Español',value: 'es'};
      for(var i=0; i < $scope.langList.length; i++){
        if($scope.langList[i].value === key){
          lang = $scope.langList[i];
        }
      }
      return lang;
    };

    $rootScope.currentLang = $window.currentLang;
    $scope.currencyList = currencies;

    $rootScope.global_exchange_rates = exchange_rates;
    $rootScope.global_base_currency = base_currency;
    $rootScope.global_currency = localStorageService.get('global_currency') || base_currency;
    $rootScope.global_lang = $scope.initLang($rootScope.currentLang);


    $scope.currency = $scope.currencyList[0];

    $scope.setCurrency = function(val){
      $rootScope.global_currency = val;
      $rootScope.$broadcast('CURRENCY_CHANGE');
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

    $scope.getToursCategories = function() {
      toursService.getCategories().then(function(res){
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
        title: ($rootScope.currentLang=='es') ? 'Mensaje enviado' : 'Message sent',
        message: ($rootScope.currentLang=='es') ? 'Gracias por enviar tu mensaje' : 'Thanks, your message has been sent'
      };
      var optionsFail = {
        title: ($rootScope.currentLang=='es') ? 'Revisa tu información' : 'Check your information',
        message: ($rootScope.currentLang=='es') ? 'Revisa tu información e intenta de nuevo' : 'Check your information and try again'
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

    $scope.getTourDiscount = function(tour){
      var disc = 0;
      if($scope.isGlobalDiscountActive){
        disc = cartService.getPercentageDiscount(tour.commission_agency);
      }
      return disc;
    };


    $scope.setupCounter = function(isHome){
      if($scope.isGlobalDiscountActive){
        var selector = '#counter-general';
        if(isHome) {
          selector = '#counter-home';
        }
        var daysLabel = $rootScope.currentLang == 'es' ? 'Dias' : 'Days';
        var hoursLabel = $rootScope.currentLang == 'es' ? 'Horas' : 'Hours';
        var minutesLabel = $rootScope.currentLang == 'es' ? 'Minutos' : 'Minutes';
        var secondsLabel = $rootScope.currentLang == 'es' ? 'Segundos' : 'Seconds';

        var layoutHtml = '<div class="counter-col" flex><p class="num">{dn}</p><p>'+daysLabel+'</p></div>';
        layoutHtml += '<div class="counter-col" flex><p class="num">{hn}</p><p>'+hoursLabel+'</p></div>';
        layoutHtml += '<div class="counter-col" flex><p class="num">{mn}</p><p>'+minutesLabel+'</p></div>';
        layoutHtml += '<div class="counter-col" flex><p class="num">{sn}</p><p>'+secondsLabel+'</p></div>';

        $timeout(function(){
          $(selector).countdown({until: new Date(2016, 4, 30), layout: layoutHtml});
        }, 1000);
      }
    };

    $scope.getToursCategories();
    //$scope.setupCounter();

}]);
