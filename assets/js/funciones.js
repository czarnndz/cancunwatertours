/*detalles*/
$(document).ready(function() {

  var owl = $(".cont-imagen-detalle");
  var owl = $('.tour-slider');

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

/*buscar*/
  /*$(".input-header").click(function(event){
    console.log("entre");
    if ($("#buscar-header").hasClass('desactivar')) {
      //console.log("buscar abierta");
      $("#buscar-header").removeClass("desactivar");
      $("#buscar-header").addClass("activar");
      $(".text-header").css({ background : 'white', color : '#64CBE4'});
      $("#buscar-avanzado-header").addClass("desactivar");
      $("#buscar-avanzado-header").removeClass("activar");
    }else if ($("#buscar-header").hasClass('activar')) {
      $("#buscar-header").addClass("desactivar");
      $("#buscar-header").removeClass("activar");
    }
  });
  */
/*buscar*/

/*buscar avanzada*/
  /*$(".text-header").click(function(event){
    if ($("#buscar-avanzado-header").hasClass('desactivar')) {
      //console.log("avanzada abierta")
      $(".text-header").css({ background : '#00ADEF', color : 'white'});
      $("#buscar-avanzado-header").removeClass("desactivar");
      $("#buscar-avanzado-header").addClass("activar");
      $("#buscar-header").addClass("desactivar");
      $("#buscar-header").removeClass("activar");
    }else if ($("#buscar-avanzado-header").hasClass('activar')) {
      $(".text-header").css({ background : 'white', color : '#64CBE4'});
      $("#buscar-avanzado-header").addClass("desactivar");
      $("#buscar-avanzado-header").removeClass("activar");
    }
  });*/
  /*buscar avanzada*/

/*registro*/
    $(".registro").click(function(event){
      //alert("login");
    if ($("#registrar-cont").hasClass('desactivar')) {
      //console.log("avanzada abierta")
      $("#registrar-cont").removeClass("desactivar");
      $("#registrar-cont").addClass("activar");
      $("#login-cont").addClass("desactivar");
      $("#login-cont").removeClass("activar");
    }else if ($("#registrar-cont").hasClass('activar')) {
      $("#registrar-cont").addClass("desactivar");
      $("#registrar-cont").removeClass("activar");
    }
  });
/*registro*/

/*login*/
  $(".login").click(function(event){
      //alert("login");
    if ($("#login-cont").hasClass('desactivar')) {
      //console.log("avanzada abierta")
      $("#login-cont").removeClass("desactivar");
      $("#login-cont").addClass("activar");
      $("#registrar-cont").addClass("desactivar");
      $("#registrar-cont").removeClass("activar");
    }else if ($("#login-cont").hasClass('activar')) {
      $(".text-header").css({ background : 'white', color : '#64CBE4'});
      $("#login-cont").addClass("desactivar");
      $("#login-cont").removeClass("activar");
    }
  });
/*login*/

  $("#cont-global").click(function(event){
    //console.log("global")
    if ($("#buscar-header").hasClass('activar') || $("#buscar-avanzado-header").hasClass('activar') || $("#login-cont").hasClass('activar') || $("#registrar-cont").hasClass('activar')) {
      $("#login-cont").removeClass("activar");
      $("#login-cont").addClass("desactivar");
      $("#registrar-cont").addClass("desactivar");
      $("#registrar-cont").removeClass("activar");
      $("#buscar-avanzado-header").addClass("desactivar");
      $("#buscar-avanzado-header").removeClass("activar");
      $("#buscar-header").addClass("desactivar");
      $("#buscar-header").removeClass("activar");
      $(".text-header").css({ background : 'white', color : '#64CBE4'});
    }
  });

/*avanzada movil*/
  /*
  $("#text-ava-movil").click(function(event){
    //console.log("text ava")
    if ($("#b-avanzada").hasClass('buscar-movil-ap')) {
      //console.log("avanzada abierta")
      $("#b-avanzada").removeClass("buscar-movil-ap");
      $("#b-avanzada").addClass("buscar-movil-en");
    }else if ($("#b-avanzada").hasClass('buscar-movil-en')) {
      $("#b-avanzada").addClass("buscar-movil-ap");
      $("#b-avanzada").removeClass("buscar-movil-en");
    }
  });*/
/*avanzada movil*/

/*menu movil*/
/*
  $("#menu").click(function(event){
    console.log("menu");
    if ($("#cont-menu").hasClass('desactivar')) {
      //console.log("avanzada abierta")
      $("#cont-menu").removeClass("desactivar");
      $("#cont-menu").addClass("activar");
    }else if ($("#cont-menu").hasClass('activar')) {
      $("#cont-menu").addClass("desactivar");
      $("#cont-menu").removeClass("activar");
    }
  });

  $("#cerrar-menu-movil").click(function(event){
    console.log("menu cerrar");
    if ($("#cont-menu").hasClass('activar')) {
      $("#cont-menu").addClass("desactivar");
      $("#cont-menu").removeClass("activar");
    }
  });
*/
/*menu movil*/
//
///*pago*/
//   $(".tu-reservacion").click(function(event){
//    $("#tu-reservacion").addClass("activar");
//    $("#tu-reservacion").removeClass("ng-hide");
//    $("#boton-reserva").removeClass("ng-hide");
//      if($('#datos-viajero').hasClass('activar') || $('#pago-reservacion').hasClass('activar') ){
//        $("#datos-viajero").removeClass("activar");
//        $("#datos-viajero").addClass("ng-hide");
//        $("#pago-reservacion").removeClass("activar");
//        $("#pago-reservacion").addClass("ng-hide");
//    }
//   });
///*pago*/
//
///*datos viajero*/
//   $(".datos-v").click(function(event){
//    $("#datos-viajero").addClass("activar");
//    $(".datos-v").addClass("fuente-r");
//    $("#boton-reserva").removeClass("ng-hide");
//    $("#datos-viajero").removeClass("ng-hide");
//      if($('#tu-reservacion').hasClass('activar') || $('#pago-reservacion').hasClass('activar') ){
//        $("#tu-reservacion").removeClass("activar");
//        $("#tu-reservacion").addClass("ng-hide");
//        $("#pago-reservacion").removeClass("activar");
//        $("#pago-reservacion").addClass("ng-hide");
//    }
//   });
///*datos viajero*/
//
///*pago del tour*/
//   $(".pago-r").click(function(event){
//    $("#pago-reservacion").addClass("activar");
//    $(".pago-r").addClass("fuente-r");
//     $("#boton-reserva").removeClass("activar");
//     $("#boton-reserva").addClass("ng-hide");
//    $("#pago-reservacion").removeClass("ng-hide");
//      if($('#tu-reservacion').hasClass('activar') || $('#datos-viajero').hasClass('activar') ){
//        $("#tu-reservacion").removeClass("activar");
//        $("#tu-reservacion").addClass("ng-hide");
//        $("#datos-viajero").removeClass("activar");
//        $("#datos-viajero").addClass("ng-hide");
//    }
//   });
///*pago del tour*/
//
///*boton reserva*/
//  $("#boton-reserva").click(function(event){
//      if($('#tu-reservacion').hasClass('activar') ){
//        $("#tu-reservacion").removeClass("activar");
//        $("#tu-reservacion").addClass("ng-hide");
//        $(".tu-reservacion").addClass("fuente-r");
//        $("#datos-viajero").addClass("activar");
//        $("#datos-viajero").removeClass("ng-hide");
//    }else{
//      if($('#datos-viajero').hasClass('activar') ){
//        $("#datos-viajero").removeClass("activar");
//        $("#datos-viajero").addClass("ng-hide");
//        $(".datos-v").addClass("fuente-r");
//        $(".pago-r").addClass("fuente-r");
//        $("#pago-reservacion").addClass("activar");
//        $("#pago-reservacion").removeClass("ng-hide");
//         $("#boton-reserva").removeClass("activar");
//        $("#boton-reserva").addClass("ng-hide");
//    }else{
//      if($('#pago-reservacion').hasClass('activar') ){
//        $(".pago-r").addClass("fuente-r");
//        $("#boton-reserva").removeClass("activar");
//        $("#boton-reserva").addClass("ng-hide");
//
//      }
//    }
//    }
//   });
/*boton reserva */


   $("#boton-pagar").click(function(event){
     $(".pago-r").addClass("fuente-r");
   });

  $("#ap-precio").click(function(event){
      $(".ap-precio").toggleClass("ap-color");
    });

  $("#ap-nuevas").click(function(event){
      $(".ap-nuevas").toggleClass("ap-color");
    });

  $("#ap-populares").click(function(event){
      $(".ap-populares").toggleClass("ap-color");
    });

  $("#ap-mas").click(function(event){
      $(".ap-mas").toggleClass("ap-color");
    });

  var div_alto = $('#cont-global').height();
  $('.alto').css('height',div_alto);


  $( document ).ready(function() {
    var div_mapa = $('.descripcion-detalle').height();
      $('.alto-mapa').css('height',div_mapa);
      $('.alto-mapa').css('height',div_mapa);
     // console.log(div_mapa);
  });

  $( window ).resize(function() {

      var div_mapa = $('.descripcion-detalle').height();
      $('.alto-mapa').css('height',div_mapa);
      $('.alto-mapa').css('height',div_mapa);
     // console.log(div_mapa);

  });



});
