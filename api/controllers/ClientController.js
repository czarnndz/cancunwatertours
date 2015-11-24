/**
 * ClientController
 *
 * @description :: Server-side logic for managing Clients
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var passport = require('passport');

module.exports = {
  create : function(req,res, next){
    if(!req.user){
      var form = Common.formValidate(req.params.all(),['name','address','password','password_confirm','phone','rfc','comments','email','city','state','country']);
      if(form && form.password != '' && form.password === form.password_confirm){
        var email = form.email;
        var password = form.password;
        form.source = 'WebSite';
        delete form.password;
        delete form.password_confirm;
        Client_.create(form).exec(function(err,client_){
            if(err){
              console.log(err);
              return res.redirect('/');
            }

            client_.setPassword(password);

            Client_contact.create({ name : client_.name , phone : client_.phone , email : email , client : client_.id }).exec(function(err,contact) {
              if (err) {
                return res.redirect('/');
              }

              req.logIn(client_, function(err) {
                if (err) {
                  console.log(err);
                }else{
                  return res.redirect('/');
                }
              });

            });
        });
      }else{
        return res.redirect('/');
      }
    }else{
      return res.redirect('/');
    }
  },
};

