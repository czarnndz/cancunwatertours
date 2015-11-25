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
                //Fix temporal tour undefined
                if (e || !tour) {
                    console.log(e);
                    return res.notFound();
                }
                var qparams = {
                    id : { '!' : params.id}
                }
                if (tour.location) {
                    qparams = {
                        location: tour.location.id
                    }
                }
                Tour.find(qparams).limit(3).sort('fee desc').populate('location').populate('categories').exec(function(e,similar_tours){
                    TourTourcategory.find({ tour_categories : tour.id }).exec(function(err,rate_values){
                        //console.log(e);
                        res.view({
                            tour : Common.formatTour(tour,'es'),
                            rate_values : rate_values,
                            similar_tours : Common.formatTours(similar_tours,'es'),
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
