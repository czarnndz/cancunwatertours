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
   $(".text-header").click(function(event){
   	$("#buscar-avanzado-header").addClass("activar");
   	$("#buscar-avanzado-header").removeClass("ng-hide");
      if($('#buscar-header').hasClass('activar') || $('#cont-menu').hasClass('activar') ){
         $("#buscar-header").removeClass("activar");
   		 $("#buscar-header").addClass("ng-hide");
   		 $("#cont-menu").removeClass("activar");
   		 $("#cont-menu").addClass("ng-hide");
    }
   });
});

$(document).ready(function(){
   $(".input-busqueda").click(function(event){
   	$("#buscar-header").addClass("activar");
   	$("#buscar-header").removeClass("ng-hide");
      if($('#buscar-avanzado-header').hasClass('activar') || $('#cont-menu').hasClass('activar') ){
         $("#buscar-avanzado-header").removeClass("activar");
   		 $("#buscar-avanzado-header").addClass("ng-hide");
   		 $("#cont-menu").removeClass("activar");
   		 $("#cont-menu").addClass("ng-hide");
    }
   });
});

$(document).ready(function(){
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
});

$(document).ready(function(){
   $("#cont-global").click(function(event){
      if($('#buscar-avanzado-header').hasClass('activar') || $('#buscar-header').hasClass('activar') || $('#cont-menu').hasClass('activar') ){
         $("#buscar-avanzado-header").removeClass("activar");
   		 $("#buscar-avanzado-header").addClass("ng-hide");
   		 $("#buscar-header").removeClass("activar");
   		 $("#buscar-header").addClass("ng-hide");
   		 $("#cont-menu").removeClass("activar");
   		 $("#cont-menu").addClass("ng-hide");
    }
   });
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