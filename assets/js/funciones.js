/*detalles*/
$(document).ready(function() {

  var owl = $(".cont-imagen-detalle");

  owl.owlCarousel({
      items : 1, //10 items above 1000px browser width
      itemsDesktop : [1000,1], //5 items between 1000px and 901px
      itemsDesktopSmall : [900,1], // betweem 900px and 601px
      itemsTablet: [600,1], //2 items between 600 and 0
      itemsMobile : [400,1] // itemsMobile disabled - inherit from itemsTablet option
    });

});
/*detalles*/

$(document).ready(function(){

var height1 =  parseInt($('#buscar-avanzado-header').css('height').replace('px',''));
var height2 =  parseInt($('#buscar-avanzado-header').css('height').replace('px',''));

   $(".text-header").click(function(event){
     height1 =  parseInt($('#buscar-avanzado-header').css('height').replace('px',''));
     console.log(height1);
    if (height1 <= 1) {
      console.log('el alto es de 1');
      height1 = $("#buscar-avanzado-header").css('height' , '210px');
      $("#buscar-avanzado-header").css('opacity' , '1');
      $(".text-header").css({ background : '#00ADEF', color : 'white'});
      $(".buscar-avanzado-header").removeClass("ng-hide");
      height2 = $("#buscar-header").css('height' , '0px');
      $("#buscar-header").css('opacity' , '0');
      height1 = 100;
    }else if(height1 > 1){
      console.log('el alto es de 100');
       height1 = $("#buscar-avanzado-header").css('height' , '0px');
      $("#buscar-avanzado-header").css('opacity' , '0');
      $(".text-header").css({ background : 'white', color : '#64CBE4'});
      $(".buscar-avanzado-header").addClass("ng-hide");
      height1 = 0;
    }
   /*$(".text-header").click(function(event){
   	$("#buscar-avanzado-header").addClass("activar");
   	$("#buscar-avanzado-header").removeClass("ng-hide");
      if($('#buscar-header').hasClass('activar') || $('#cont-menu').hasClass('activar') ){
         $("#buscar-header").removeClass("activar");
   		 $("#buscar-header").addClass("ng-hide");
   		 $("#cont-menu").removeClass("activar");
   		 $("#cont-menu").addClass("ng-hide");
    }
   });*/
});

   $(".input-busqueda").click(function(event){
     height2 =  parseInt($('#buscar-header').css('height').replace('px',''));
     console.log(height1);
    if (height2 <= 1) {
      console.log('el alto es de 1');
      height2 = $("#buscar-header").css('height' , 'auto');
      $("#buscar-header").css('opacity' , '1');
      $(".buscar-header").removeClass("ng-hide");
      height1 = $("#buscar-avanzado-header").css('height' , '0px');
      $("#buscar-avanzado-header").css('opacity' , '0');
      $(".buscar-avanzado-header").addClass("ng-hide");
      height2 = 100;
    }else if(height2 > 1){
      console.log('el alto es de 100');
      height2 = $("#buscar-header").css('height' , '0px');
      $("#buscar-header").css('opacity' , '0');
      $(".text-header").css({ background : 'white', color : '#64CBE4'});
      $(".buscar-header").addClass("ng-hide");
      height2 = 0;
    }
   	$/*("#buscar-header").addClass("activar");
   	$("#buscar-header").removeClass("ng-hide");
      if($('#buscar-avanzado-header').hasClass('activar') || $('#cont-menu').hasClass('activar') ){
         $("#buscar-avanzado-header").removeClass("activar");
   		 $("#buscar-avanzado-header").addClass("ng-hide");
   		 $("#cont-menu").removeClass("activar");
   		 $("#cont-menu").addClass("ng-hide");
    }*/
   });

   $("#menu").click(function(event){
   	$("#cont-menu").addClass("activar");
   	$("#cont-menu").removeClass("ng-hide");
      if($('#buscar-avanzado-header').hasClass('activar') || $('#buscar-header').hasClass('activar') ){
         $("#buscar-avanzado-header").removeClass("activar");
   		 $("#buscar-avanzado-header").addClass("ng-hide");
   		 $("#buscar-header").removeClass("activar");
   		 $("#buscar-header").addClass("ng-hide");
    }
   });




   $("#cont-global").click(function(event){
    $("#cont-menu").removeClass("activar");
    $("#cont-menu").addClass("ng-hide");
    height2 = $("#buscar-header").css('height' , '0px');
      $("#buscar-header").css('opacity' , '0');
      $(".text-header").css({ background : 'white', color : '#64CBE4'});
      $(".buscar-header").addClass("ng-hide");
      $(".buscar-header").addClass("ng-hide");
       height1 = $("#buscar-avanzado-header").css('height' , '0px');
      $("#buscar-avanzado-header").css('opacity' , '0');
      $(".text-header").css({ background : 'white', color : '#64CBE4'});
      $("#agregar-transporte").addClass("ng-hide");
      /*if($('#buscar-avanzado-header').hasClass('activar') || $('#buscar-header').hasClass('activar') || $('#cont-menu').hasClass('activar') ){
       $("#buscar-avanzado-header").removeClass("activar");
   		 $("#buscar-avanzado-header").addClass("ng-hide");
   		 $("#buscar-header").removeClass("activar");
   		 $("#buscar-header").addClass("ng-hide");
   		 $("#cont-menu").removeClass("activar");
   		 $("#cont-menu").addClass("ng-hide");
    }*/
   });



   $(".tu-reservacion").click(function(event){
    $("#tu-reservacion").addClass("activar");
    $("#tu-reservacion").removeClass("ng-hide");
      if($('#datos-viajero').hasClass('activar') || $('#pago-reservacion').hasClass('activar') ){
        $("#datos-viajero").removeClass("activar");
        $("#datos-viajero").addClass("ng-hide");
        $("#pago-reservacion").removeClass("activar");
        $("#pago-reservacion").addClass("ng-hide");
    }
   });



   $(".datos-v").click(function(event){
    $("#datos-viajero").addClass("activar");
    $("#datos-viajero").removeClass("ng-hide");
      if($('#tu-reservacion').hasClass('activar') || $('#pago-reservacion').hasClass('activar') ){
        $("#tu-reservacion").removeClass("activar");
        $("#tu-reservacion").addClass("ng-hide");
        $("#pago-reservacion").removeClass("activar");
        $("#pago-reservacion").addClass("ng-hide");
    }
   });



   $(".pago-r").click(function(event){
    $("#pago-reservacion").addClass("activar");
    $("#pago-reservacion").removeClass("ng-hide");
      if($('#tu-reservacion').hasClass('activar') || $('#datos-viajero').hasClass('activar') ){
        $("#tu-reservacion").removeClass("activar");
        $("#tu-reservacion").addClass("ng-hide");
        $("#datos-viajero").removeClass("activar");
        $("#datos-viajero").addClass("ng-hide");
    }
   });



   $("#boton-reserva").click(function(event){
      if($('#tu-reservacion').hasClass('activar') ){
        $("#tu-reservacion").removeClass("activar");
        $("#tu-reservacion").addClass("ng-hide");
        $(".tu-reservacion").addClass("fuente-r");
        $("#datos-viajero").addClass("activar");
        $("#datos-viajero").removeClass("ng-hide");
    }else{
      if($('#datos-viajero').hasClass('activar') ){
        $("#datos-viajero").removeClass("activar");
        $("#datos-viajero").addClass("ng-hide");
        $(".datos-v").addClass("fuente-r");
        $("#pago-reservacion").addClass("activar");
        $("#pago-reservacion").removeClass("ng-hide");
         $("#boton-reserva").removeClass("activar");
        $("#boton-reserva").addClass("ng-hide");
    }else{
      if($('#pago-reservacion').hasClass('activar') ){
        $(".pago-r").addClass("fuente-r");

      }
    }
    }
   });

  var div_alto = $('#cont-global').height(); 
  $('.alto').css('height',div_alto)
});

/*$(document).ready(function(){
   $(".input-busqueda").click(function(event){
      if($('.menu-2').hasClass('desactivar')){
         $(".menu-2").addClass("desactivar");   
       }else{
      $(".menu-2").removeClass("desactivar");
    }
   });
});*/
angular.module('water-tours').controller('DatepickerDemoCtrl', function ($scope) {
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 2);
  $scope.events =
    [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

  $scope.getDayClass = function(date, mode) {
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i=0;i<$scope.events.length;i++){
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  };
});