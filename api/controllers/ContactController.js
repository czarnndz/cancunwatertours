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

    if( validateEmail(data.contactEmail) && form.contactName !== '' ){
      var head = {
        to: 'info@watertours.com',
        //to: 'luis19prz@gmail.com',
        subject: 'Mensaje desde Cancunwater Tours'
      };
      sails.hooks.email.send(
        "contactForm", data, head,
        function(err) {
          if(err){
            res.json({m:'f'})
          }else{
            res.json({m:'s'})
          }
        }
      );
    }else{
      res.redirect('/contacto?m=f');
    }
  }
};

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

