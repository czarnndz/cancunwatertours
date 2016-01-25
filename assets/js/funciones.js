
$(document).ready(function() {
  if($(".perfectscrollbar").length){
    $(".perfectscrollbar").perfectScrollbar();
  }

  setTimeout(function(){
    var $conektaIframe = $('#conekta-flag').next();
    if($conektaIframe.length > 0){
      $conektaIframe.hide();
    }
  }, 1000);

});
