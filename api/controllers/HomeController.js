/**
 * HomeController
 *
 * @description :: Server-side logic for managing homeis
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var bcrypt = require('bcrypt');
module.exports = {
	index : function(req,res){
    var params = req.params.all();

    var lang = params.lang || 'es';
    //TODO verificar mejor practica
    req.params.lang = lang;
    req.session.lang = lang;
    req.setLocale(lang);


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
    var params = req.params.all();
    if (params.url.match(/\..+$/)) res.notFound();
    TourCategory.findOne({ url : params.url }).exec(function(err,category){
      if (err) {
        console.log(err);
      } else if (!_.isUndefined(category)){
        //console.log("assasasassssssssssssssssssssss");
        //console.log(category);
        params.category = category.id;
        resultados(params,res);
      } else {
        res.notFound();
      }
    })

  },
  resultados_l : function(req,res){
    var params = req.params.all();
    resultados(params,res);
  },
  tour_list : function(req,res){
    var params = req.params.all();

    var queryCategories = {};

    if(params.category) {
      queryCategories.id = params.category;
    }

    TourCategory.find(queryCategories).populate('tours',{ visible : true }).exec(function(e,results){
        if (e)  {
          console.log(e);
          throw e;
        }
        var auxTourIds = [];
        _.map(results,function(category){
          _.map(category.tours,function(tour){
            auxTourIds.push(tour.id);
            //console.log(tour.name.replace(/[^a-zA-Z0-9 ]/g,'').replace(/\s+/g, '-').toLowerCase());
          });
        });
        var tourIds = _.uniq(auxTourIds);
        Common.getTours(function(err,tour_list){
          res.json(tour_list);
        },params.page,params.pageSize,params.sort,params.name,params.category,params.maxFee,params.minFee,tourIds,params.all);
    });
  },
  toursSearchByName: function(req, res){
    var params = req.params.all();
    if (params.term){
      var term = params.term;
      Tour.find({ select: ['id','name','icon','url'] , name:{'like': '%'+term+'%'}, visible : true, limit:10 }).exec(function(e,tours){
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
          //console.log(categories[0].tours);
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
            searchUrl : '/tours',
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
            searchUrl : '/tours',
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
            searchUrl : '/tours',
            placeholder : 'Buscar'
        }
      });
    });
  },

  setUrl : function(req,res) {
    Tour.find({ select: ['name','url'],visible : true }).exec(function(err,tours){
      console.log(tours);
      async.mapSeries( tours, function(tour,CB){
        tour.url = Common.stringReplaceChars(tour.name);
        console.log(tour);
        tour.save(CB);
      },function(ress){
        res.json(ress);
      });
    });
  },

  changeLang: function(req, res){
    var params = req.params.all();
    var lang = params.lang;
    var previousLang = params.previous_lang || '';
    var fromUrl = params.from_url || '';

    var path = fromUrl.replace('/'+previousLang, '');
    var redirect = '/' + lang;
    if(path && path !== '' && path !== '/'){
      redirect +=  path;
    }

    req.session.lang = lang;
    req.setLocale(lang);
    res.redirect(redirect);
  }

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

var resultados = function(params,res) {
  TourCategory.find({ principal:true, type : {'!' : 'rate'}}).populate('tours',{ visible : true }).exec(function(e,categories) {
    TourCategory.find({ principal : { '!' : true }, type : {'!' : 'rate'}}).populate('tours',{ visible : true }).exec(function(e,sec_categories){
      TourCategory.find({ principal : { '!' : true }, type : 'rate' }).populate('tours',{ visible : true }).exec(function(e,rate_categories){
        formatRateCategories(rate_categories,function(rc){
          res.view('home/resultados',{
            meta: {
              controller: 'home.js',
              addMenu: true,
              categories : categories,
              sec_categories : sec_categories||[],
              rate_categories : rc||[],
              req : params
            },
            page: {
              searchUrl: '/tours',
              placeholder: 'Buscar'
            }
          });//res
        });//format categories
      });//rates
    })//subcategories
  });//principal categories
}
