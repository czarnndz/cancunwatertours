/**
 * ContactController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  index: function(req,res){
    var form = req.params.all();
    var message = '';
    if(form.m && form.m == 's'){
      message = 'Gracias por enviar tu mensaje';
    }else if(form.m && form.m == 'f'){
      message = 'Hubo un error al enviar tu mensaje, intenta de nuevo';
    }

    res.view({
      meta : {
        controller : 'cuenta.js',
        addMenu : false
      },
      page : {
        searchUrl : '/index',
        placeholder : 'Buscar',
        message: message
      }
    });
  },
  send: function(req, res){
    var form = req.params.all();
    var data = {
      contactName: form.contactName || "No name",
      contactEmail: form.contactEmail || "No email",
      contactMessage: form.contactMessage || 'No message'
    };
    var head = {
      to: form.contactEmail,
      subject: 'Mensaje desde Cancunwater Tours'
    };
    sails.hooks.email.send(
      "contactForm", data, head,
      function(err) {
        if(err){
         console.log(err);
         res.redirect('/contacto?m=f');
        }else{
          res.redirect('/contacto?m=s');
        }
      }
    );
  }
};

