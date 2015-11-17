
$(document).ready(function() {

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

   $("#boton-pagar").click(function(event){
     $(".pago-r").addClass("fuente-r");
   });
});
