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
    port = process.env.PORT || 1337;

module.exports.bootstrap = function (cb) {

    // It's very important to trigger this callack method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

    //cb();
    server.kill(function(err){
        cb();
    });
};

server = http.createServer(function(req, res){
    res.end('loading Cancun water tours... ');
}).listen(port, function(){
});

killable(server);
module.exports.bootstrap = function(cb) {
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
