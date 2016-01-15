/**
 * ClientController
 *
 * @description :: Server-side logic for managing Clients
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var passport = require('passport');
var bcrypt = require('bcrypt');

module.exports = {
  create : function(req,res, next){
    if(!req.user){
      var form = Common.formValidate(req.params.all(),['name','last_name','address','password','password_confirm','phone','rfc','comments','email','city','state','country']);
      if(form && form.password != '' && form.password === form.password_confirm){
        var email = form.email;
        var password = form.password;
        //form.source = 'WebSite';
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
  update: function(req,res){
      var form = Common.formValidate(req.params.all(),['id','name','last_name','address','phone','rfc','comments','email','city','state','country']);
      if(form && validateEmail(form.email) ){
          delete form.contacts;
          Client_.update({id:form.id},form).exec(function(err,client_){
            if(err) return res.redirect('/' + req.getLocale() + '/account?m=f');

            return res.redirect('/' + req.getLocale() + '/account?m=s');
          });
      }else{
        return res.redirect('/' + req.getLocale() + '/account?m=f');
      }
  },
  recover_password: function(req, res){
    //if(!req.user){
      var form = req.params.all();
      var messageCode = '';
      if(form.msg && form.msg == 's'){
        messageCode = 'success';
      }else if(form.msg && form.msg == 'f'){
        messageCode = 'failed';
      }
      return res.view({messageCode: messageCode});
    /*}
    return res.redirect('/');*/
  },
  send_password_recovery: function(req, res){
    var form = req.params.all();
    var email = form.email_to || false;
    var lang = req.getLocale();
    if(email && validateEmail(email) ){
      Client_.findOne( {email:email}, {select: ['id', 'password', 'email']} ).exec(function(err,client){
        if(err){
          console.log(err);
          return res.redirect('/');
        }else{
          var values = client.id + client.email + client.password;
          var tokenAux = bcrypt.hashSync(values ,bcrypt.genSaltSync(10));
          var token = tokenAux.replace(/\//g, "-");
          var recoverURL = req.baseUrl + '/' + lang +  '/change_password?';
          recoverURL += 'token='+token;
          recoverURL += '&email='+email;
          sendPasswordRecoveryEmail({recoverURL: recoverURL, email: email}, res, req);
        }
      });
    }
  },
  //CHANGE PASSWORD MESSAGE VIEW
  change_password_message: function(req, res){
    var form = req.params.all();
    var messageCode = '';
    if(form.msg){
      if(form.msg == 's'){
        messageCode = 'success';
      }else if(form.msg == 'f'){
        messageCode = 'failed';
      }
    }
    return res.view({messageCode:messageCode});
  },
  //CHANGE PASSWORD VIEW
  change_password: function(req, res){
    var form = req.params.all();
    var lang = req.getLocale();
    if(form.token && form.email){
      validateToken(form.token, form.email, function(err, result){
        if(err){
          console.log(err);
        }

        console.log(result);

        if(!result) {
          return res.redirect('/'+lang+'/change_password_message?msg=f');
        }else{
          return res.view({
            token: form.token,
            email: form.email
          });
        }
      });
    }
    else{
      return res.redirect('/'+lang+'/change_password_message?msg=f');
    }


  },
  update_password: function(req, res){
    var form = req.params.all();
    var token = form.token || false;
    var email = form.email || false;
    var password = form.password || false;
    var confirmPass = form.confirm_pass || false;
    var lang = req.getLocale();
    if(token && email && password && confirmPass){
      if(password == confirmPass){
        validateToken(token, email, function(err, result){
          var pass = bcrypt.hashSync(confirmPass ,bcrypt.genSaltSync(10));
          Client_.update({email:email},{password: pass}).exec(function(err, client){
            if(err){
              console.log(err);
              return res.redirect('/'+lang+'/change_password_message?msg=f');
            }else{
              return res.redirect('/'+lang+'/change_password_message?msg=s');
            }
          });
        });
      }else{
        return res.redirect('/'+lang+'/change_password_message?msg=f');
      }
    }else{
      return res.redirect('/'+lang+'/change_password_message?msg=f');
    }
  }
};

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function sendPasswordRecoveryEmail(params, res, req){
  var data = {
    recoverURL: params.recoverURL,
  };
  var head = {
    to: params.email,
    subject: 'Solicitud de cambio de contraseña en Cancunwater Tours'
  };
  var lang = req.getLocale();

  sails.hooks.email.send(
    "passwordRecovery", data, head, function(err){
      if(err){
        console.log(err);
        return res.redirect('/'+lang+'/recover_password?msg=f');
      }
      return res.redirect('/'+lang+'/recover_password?msg=s');
  });
}

function validateToken(token, email, cb){
  Client_.findOne( {email:email}, {select: ['id', 'email', 'password']} ).exec(function(err,client){
    if(err){
      console.log(err);
    }
    var values = client.id + client.email + client.password;
    var realToken = values.replace(/\//g, "-");
    bcrypt.compare(realToken, token, cb);
  });
}
