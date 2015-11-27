/**
 * TourController
 *
 * @description :: Server-side logic for managing tours
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req,res){
    var params = req.params.all();
    if (params.url.match(/\..+$/)) res.notFound();
    Tour.findOne({ url : params.url }).populateAll().exec(function(e,tour){
        //Fix temporal tour undefined
        if (e || !tour) {
            console.log(e);
            return res.notFound();
        }
        var qparams = {
          url : { '!' : params.url}
        }
        if (tour.location) {
            qparams = {
                location: tour.location.id
            }
        }
        Tour.find(qparams).limit(3).sort('fee desc').populate('location').populate('categories').exec(function(e,similar_tours){
            TourTourcategory.find({ tour_categories : tour.id }).exec(function(err,rate_values){
                //console.log(e);
                TourCategory.find({ principal:true, type : {'!' : 'rate'}}).exec(function(e,categories){
                  res.view({
                      tour : Common.formatTour(tour,'es'),
                      rate_values : rate_values,
                      similar_tours : Common.formatTours(similar_tours,'es'),
                      imgs_url : process.env.BACKEND_URL,
                      meta : {
                          controller : 'tours.js',
                          removeFlexLayout : true,
                          categories: categories,
                          addMenu: true,
                      },
                      page : {
                          searchUrl : '/tours',
                          placeholder : 'Busca Tours',
                          menuselected : 'tour'
                      }
                  });
                });
            });
        });
    });
	}/*s,
  updateCategories : function(req,res) {
    Tour.find().exec(function(err,tcat){
      _.each(tcat,function(tc,cb) {
        tc.url = tc.name.replace(/\s+/g, '-').toLowerCase();
        console.log(tc);
        tc.save(cb);
      },function(){
        console.log("finish");
      });
    });
    TourCategory.find().exec(function(err,tcat){
      _.each(tcat,function(tc,cb) {
        tc.url = tc.name.replace(/\s+/g, '-').toLowerCase();
        console.log(tc);
        tc.save(cb);
      },function(){
        console.log("finish");
      });
    });
  }*/
};
