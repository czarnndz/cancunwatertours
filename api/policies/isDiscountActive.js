module.exports = function(req, res, next) {
  /*
  var lang = req.params.lang || req.session.lang || 'es';
  if( lang != 'es' && lang != 'en' )
    return res.redirect('/');
  req.setLocale(lang);
  */
  //sails.log.debug('Aplicando isDiscountActive');
  if (process.env.company_id){
    Company.findOne({id: process.env.company_id}).exec(function(err, company){

      if (err) {
        console.log(err);
      }
      if (!company) {
        throw new Error('company_id no existe');
      } else {
        //sails.log.debug('Company isActiveGlobalDiscount: ' + company.isActiveGlobalDiscount);
        sails.config.company.isActiveGlobalDiscount = company.isActiveGlobalDiscount || false;
        //sails.config.company.isActiveGlobalDiscount = true;
        //DONT REMOVE
        //sails.config.company.isActiveGlobalDiscount = true;

        next();
      }

    });
  }else{
    throw new Error("falta agregar company_id en local.js");
    next();
  }


};
