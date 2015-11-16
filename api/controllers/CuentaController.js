/**
 * HomeController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req,res){
		res.view({
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

