/**
 * HomeController
 *
 * @description :: Server-side logic for managing homeis
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req,res){
    TourCategory.find({ type : {'!' : 'rate'}}).populate('tours').exec(function(e,categories){
      //console.log(categories);
      res.view({
        meta : {
          controller : 'home.js',
          addMenu : true,
          categories : categories
        },
        page : {
          searchUrl : '/index',
          placeholder : 'Buscar'
        }
      });
    });

	},
  resultados : function(req,res){
      TourCategory.find().exec(function(e,categories) {
        res.view({
          meta: {
            controller: 'home.js',
            addMenu: false,
            categories : categories,
            req : req.params.all()
          },
          page: {
            searchUrl: '/resultados',
            placeholder: 'Buscar'
          }
        });
      });

  },
  tour_list : function(req,res){
    var params = req.params.all();
    var queryCategories = {};

    if(params.category) {
      queryCategories.id = params.category;
    }

    TourCategory.find(queryCategories).populate('tours').exec(function(e,results){
        if (e)  {
          console.log(e);
          throw e;
        }
        var auxTourIds = [];
        _.map(results,function(category){
          _.map(category.tours,function(tour){
            auxTourIds.push(tour.id);
          });
        });
        var tourIds = _.uniq(auxTourIds);
        Common.getTours(function(err,tour_list){
          res.json(tour_list);
        },req.page,req.pageSize,req.sort,req.name,req.category,req.maxFee,req.minFee,tourIds);
    });
  },
  hotel_list : function(req,res){
      var params = req.params.all();
      var s = {};
      if( params.term && params.term != '' )
          s = { name : new RegExp(params.term,"i") };
      if (!params.skip)
          params.skip = 0;
      Hotel.find().exec(function(e,hotels){
          if (e) {
              console.log(e);
              throw e;
          }
          res.json( Common.formatHotels(hotels,'es'/*req.getLocale()*/) );
      });
  },
  reserva : function(req,res) {
      res.view({
          meta : {
              controller : 'reserva.js'
          },
          page : {
              searchUrl : '/reserva',
              placeholder : 'Buscar'
          }
      });
  },
  tour_categories: function(req, res){
      TourCategory.find({type : {'!' : 'rate'}}).exec(function(e,categories){
          if (e) {
              console.log(e);
              throw e;
          }
          res.json({categories:categories});
      });
  }
};

