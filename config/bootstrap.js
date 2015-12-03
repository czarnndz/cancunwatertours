/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */
var killable = require('killable'),
    server,
    http = require('http'),
    port = process.env.PORT || 1195;

module.exports.bootstrap = function (cb) {

    if (process.env.company_id){

      Company.findOne({ id : process.env.company_id}).populate('currencies').populate('base_currency').exec(function(err,company){
        if (err) {
          console.log(err);
        }
        if (!company) {
          throw new Error('company_id no existe');
        } else {
          sails.config.company = company;
          server.kill(function(err){
            cb();
          });
        }
      });
    } else {
      throw new Error("falta agregar company_id en local.js");
    }
    // It's very important to trigger this callack method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

    //cb();

};

server = http.createServer(function(req, res){
    res.end('loading Cancun water tours... ');
}).listen(port, function(){
});

killable(server);
