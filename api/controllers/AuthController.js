/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var passport = require('passport');

module.exports = {

  process: function(req, res){
    var form = req.params.all();
    var isBooking = false;
    if (form.is_booking && form.is_booking == '1'){
      isBooking = true;
    }
    passport.authenticate('local', function(err, user, info) {
      if ((err) || (!user)) {
        console.log('fail login');
        return res.redirect('/');
      }
      req.logIn(user, function(err) {
        if (err) res.send(err);
        if(isBooking){
          return res.redirect('/reserva');
        }else{
          return res.redirect('/');
        }
      });
    })(req, res);
  },

  logout: function (req,res){
    req.logout();
    res.redirect('/');
  },

  process_fb: function (req, res) {
    passport.authenticate('facebook', { scope: ['email', 'user_about_me']},function (err, user) {
      if ((err) || (!user)) {
        console.log('fail login');
        return res.redirect('/');
      }
      req.logIn(user, function(err) {
        if (err) res.send(err);
        return res.redirect('/');
      });
    })(req, res);
  },

  fb_callback: function(req, res) {
    passport.authenticate('facebook', { failureRedirect: process.env.FRONTEND_URL, scope: ['email'] }, function(err, user) {
      req.logIn(user, function(err) {
        if (err) {
          console.log('fail login');
          console.log(err);
          return res.redirect(process.env.FRONTEND_URL);
        }
        console.log('logeado');
        return res.redirect(process.env.FRONTEND_URL);
      });
    })(req, res);
  },
};

