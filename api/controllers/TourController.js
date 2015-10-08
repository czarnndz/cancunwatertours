/**
 * TourController
 *
 * @description :: Server-side logic for managing tours
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req,res){
        var params = req.params.all();
		if (params.id) {
            Tour.findOne({ id : params.id }).populateAll().exec(function(e,tour){
                if (e) {
                    console.log(e);
                    res.notFound();
                }
                console.log(tour);
                Tour.find({location:tour.location.id,id : { '!' : params.id}}).limit(3).sort('fee desc').populate('location').exec(function(e,similar_tours){
                    //console.log(e);
                    //console.log(Common.formatTours(similar_tours,'es'));
                    Tour.find({location:tour.location.id,id : { '!' : params.id}}).limit(3).sort('name').populate('location').exec(function(e,suggested_tours){
                        //console.log(e);
                        //console.log(Common.formatTours(suggested_tours,'es'));
                        res.view({
                            tour : Common.formatTour(tour,'es'),
                            similar_tours : Common.formatTours(similar_tours,'es'),
                            suggested_tours : Common.formatTours(suggested_tours,'es'),
                            imgs_url : process.env.BACKEND_URL,
                            meta : {
                                controller : 'tours.js',
                                removeFlexLayout : true
                            },
                            page : {
                                searchUrl : '/detalle/',
                                placeholder : 'Busca Tours',
                                menuselected : 'tour'
                            }
                        });
                    });
                });
            });
        } else {
            res.notFound();
        }
	}
};