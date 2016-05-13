module.exports = function(req, res, next) {
  var lang = req.params.lang || req.session.lang || 'es';
  req.setLocale(lang);
  if( lang != 'es' && lang != 'en' )
    return res.redirect('/');

  next();

};
