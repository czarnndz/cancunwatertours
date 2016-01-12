module.exports = function(req, res, next) {
  var lang = req.params.lang || req.session.lang || 'es';
  if( lang != 'es' && lang != 'en' )
    return res.redirect('/');
  req.setLocale(lang);
  next();
};
