
$(document).ready(function() {
  if($(".perfectscrollbar").length){
    $(".perfectscrollbar").perfectScrollbar({wheelPropagation: true});
  }

  setTimeout(function(){
    var $conektaIframe = $('#conekta-flag').next();
    if($conektaIframe.length > 0){
      $conektaIframe.hide();
    }
  }, 1000);

});
