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
        Tour.findOne({ url : params.url })
            .populate('extra_prices')
            .populate('price')
            .populate('categories')
            .populate('location')
            .populate('transferHotels')
            .populate('provider')
            .exec(function(e,tour){
            //Fix temporal tour undefined
            if (e || !tour) {
                console.log(e);
                return res.notFound();
            }
            //console.log(tour);

            var qparams = {
              url : { '!' : params.url},
              visible : true
            };
            if (tour.location) {
                qparams.location = tour.location.id;
            }
            Tour.find(qparams).limit(3).sort('fee desc').populate('price').exec(function(e,similar_tours){
                TourTourcategory.find({ tour_categories : tour.id }).exec(function(err,rate_values){
                    TourCategory.find({ principal:true, type : {'!' : 'rate'}}).exec(function(e,categories){
                        TransferPrice.find({ or : [ { zone1 : tour.zone } , { zone2 : tour.zone }], active : true}).populate('transfer').exec(function(et,transferPrices) {

                          var metadata = {
                            title: tour.meta_title_es || tour.name,
                            description: tour.meta_description_es || tour.description,
                            keywords: tour.meta_keywords_es || tour.description,
                            title_en: tour.meta_title_en || tour.name_en,
                            description_en: tour.meta_description_en || tour.description_en,
                            keywords_en: tour.meta_keywords_en || tour.description_en
                          };

                          res.view({
                              tour : Common.formatTour(tour, req.getLocale() ),
                              rate_values : rate_values,
                              similar_tours : Common.formatTours(similar_tours, req.getLocale() ),
                              imgs_url : process.env.BACKEND_URL,
                              transfer_prices : transferPrices,
                              meta : {
                                  controller : 'tours.js',
                                  removeFlexLayout : true,
                                  categories: categories,
                                  addMenu: true,
                                  metadata: metadata
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
