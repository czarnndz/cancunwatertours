/**
 * HomeController
 *
 * @description :: Server-side logic for managing homeis
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var bcrypt = require('bcrypt');
module.exports = {
	index : function(req,res){
    TourCategory.find({ principal:true, type : {'!' : 'rate'}}).populate('tours').exec(function(e,categories){
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
      TourCategory.find({ principal:true, type : {'!' : 'rate'}}).populate('tours').exec(function(e,categories) {
        TourCategory.find({ principal : { '!' : true }, type : {'!' : 'rate'}}).populate('tours').exec(function(e,sec_categories){
          TourCategory.find({ principal : { '!' : true }, type : 'rate' }).populate('tours').exec(function(e,rate_categories){
            formatRateCategories(rate_categories,function(rc){
              res.view({
                meta: {
                  controller: 'home.js',
                  addMenu: true,
                  categories : categories,
                  sec_categories : sec_categories||[],
                  rate_categories : rc||[],
                  req : req.params.all()
                },
                page: {
                  searchUrl: '/resultados',
                  placeholder: 'Buscar'
                }
              });//res
            });//format categories
          });//rates
        })//subcategories
      });//principal categories
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
  toursSearchByName: function(req, res){
    var params = req.params.all();
    if (params.term){
      var term = params.term;
      Tour.find({ select: ['id','name','icon'] , name:{'like': '%'+term+'%'}, limit:10 }).exec(function(e,tours){
        if(e){
          console.log(e);
          return res.json([]);
        }
        for(var i=0;i<tours.length;i++){
          tours[i].avatar1  = tours[i].icon ? process.env.BACKEND_URL + '/uploads/tours/196x140'+tours[i].icon.filename : '/images/small_default.jpg';
        }
        res.json(tours);
      });
    }else{
      res.json([]);
    }
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
      var params = req.params.all();
      var query = {};
      if (!params.all)
        query.type = {'!' : 'rate'};
      TourCategory.find(query).populate('tours',{select: ['id']}).exec(function(e,categories){
          if (e) {
              console.log(e);
              throw e;
          }
          console.log(categories[0].tours);
          res.json({categories:categories});
      });
  },
  quienessomos : function(req,res){
    TourCategory.find({ principal:true, type : {'!' : 'rate'}}).populate('tours').exec(function(e,categories) {
      res.view({
        meta : {
          addMenu: true,
          categories : categories,
          controller : 'home.js'
        },
        page : {
            searchUrl : '/resultados',
            placeholder : 'Buscar'
        }
      });
    });
  },
  preguntasfrecuentes : function(req,res){
    TourCategory.find({ principal:true, type : {'!' : 'rate'}}).populate('tours').exec(function(e,categories) {
      res.view({
        meta : {
          addMenu: true,
          categories : categories,
          controller : 'home.js'
        },
        page : {
            searchUrl : '/resultados',
            placeholder : 'Buscar'
        }
      });
    });
  },

  avisodeprivacidad : function(req,res){
    TourCategory.find({ principal:true, type : {'!' : 'rate'}}).populate('tours').exec(function(e,categories) {
      res.view({
        meta : {
          addMenu: true,
          categories : categories,
          controller : 'home.js'
        },
        page : {
            searchUrl : '/resultados',
            placeholder : 'Buscar'
        }
      });
    });
  },

};

var formatRateCategories = function(rc,callback){
  TourTourcategory.find().exec(function(err,ttc){
    for( var x in rc ){
      for( y in rc[x].rating ) rc[x].rating[y] = typeof rc[x].rating[y]=='string'?JSON.parse(rc[x].rating[y]):rc[x].rating[y];
      for( var y in rc[x].tours )
        for(var z in ttc)
          if( rc[x].id == ttc[z].tourcategory_tours && rc[x].tours[y].id == ttc[z].tour_categories )
            rc[x].tours[y].value = ttc[z].value;
    }
    callback(rc);
  });
}
