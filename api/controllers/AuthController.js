/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var passport = require('passport');

module.exports = {

  process: function(req, res){
    passport.authenticate('local', function(err, user, info) {
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
    passport.authenticate('facebook', { failureRedirect: '/', scope: ['email'] }, function(err, user) {
      req.logIn(user, function(err) {
        if (err) {
          console.log('fail login');
          console.log(err);
          return res.redirect('/');
        }
        console.log('logeado');
        res.redirect('/');
        return;
      });
    })(req, res);
  },
};

