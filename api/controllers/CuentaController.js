/**
 * HomeController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req,res){
    var params = req.params.all();
    var message = params.m || false;
		res.view({
      message: message,
			meta : {
				controller : 'cuenta.js',
                addMenu : false
			},
			page : {
				searchUrl : '/index',
				placeholder : 'Buscar'
			}
		});
	},
};

