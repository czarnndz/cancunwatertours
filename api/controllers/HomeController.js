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
          categories : categories,
          metadata:{
            title: 'Cancun Water Tours | Tours Acuáticos en Cancún, buceo, snorkel, pesca',
            description: 'Cancún Water Tours es una empresa especializada en actividades acuáticas en Cancun o Isla Mujeres. Reserva tours de cenotes, MUSA, buceo, catamarán, flyboard',
            keywords: 'tours en cancun, que hacer en cancun, jungle tour cancun, catamarán cancun, buceo en cancun, flyboard cancun',
            title_en: 'Cancun Water Tours | Aquatics Tours | Jungle Tour, Snorkeling, Diving',
            description_en: 'Cancun Water Tours is a company specialized in aquatics tours in Cancun and Isla Mujeres. The best cancun tours:  Snorkel, jungle tour, flyboard, scuba, MUSA',
            keywords_en: 'aquatics tours in cancun, cancun tours, what to do in cancun, snorkeling in cancun, jungle tour, cancun fishing'
          }
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
    var isCategory = true;
    if (params.url.match(/\..+$/)) res.notFound();
    TourCategory.findOne({ url : params.url }).exec(function(err,category){
      if (err) {
        console.log(err);
      } else if (!_.isUndefined(category)){
        params.category = category.id;
        var meta = {
          title: category.meta_title_es || category.name,
          description: category.meta_description_es || category.name,
          keywords: category.meta_keywords_es || category.name,
          title_en: category.meta_title_en || category.name_en,
          description_en: category.meta_description_en || category.name,
          keywords_en: category.meta_keywords_en || category.name
        };
        resultados(params,meta,res);
      } else {
        res.notFound();
      }
    })

  },
  resultados_l : function(req,res){
    var params = req.params.all();
    var meta = {
      title: 'Actividades Acuáticas y deportivas en Cancún | Pesca, Buceo, Flyboard',
      description: 'Cancún Water Tours, la mejor opción para disfrutar el mar caribe mexicano con actividades y deportes acuáticos como Buceo, Snorkel, pesca deportiva, cenotes',
      keywords: 'atracciones en cancun, tours cancun, tours acuaticos en cancun, deportes acuaticos en cancun, jungle tour cancun, snorkel cancun',
      title_en: 'The best water tours in Cancun and Isla Mujeres | Book online now',
      description_en: 'Cancun Water Tours is located in the gorgeous city of Cancun and we are the best option for any water tour. Book only a tour: Catamaran, Sailing, Snorkeling, Scuba',
      keywords_en:'what to do in cancun, snorkeling in cancun, jungle tour cancun, cancun tours,catamaran cancun, sailing in cancun, cancun water tours'
    };
    resultados(params,meta,res);
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
        params.ids = _.uniq(auxTourIds);
        Common.getTours(function(err,tour_list){
          res.json(tour_list);
        },params);
    });
  },
  toursSearchByName: function(req, res){
    var params = req.params.all();
    if (params.term){
      var query = {
          select: ['id','name','name_en','icon','url'],
          visible : true,
          limit:10
      };
      if (params.lang && params.lang == 'en') {
          query.name_en = {'like': '%'+params.term+'%'};
      } else {
          query.name = {'like': '%'+params.term+'%'};
      }
      Tour.find(query).exec(function(e,tours){
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
      //console.log(tours);
      async.mapSeries( tours, function(tour,CB){
        tour.url = Common.stringReplaceChars(tour.name);
        //console.log(tour);
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
    if(previousLang !== 'es' && previousLang!=='en'){
      previousLang = 'es';
    }
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

var resultados = function(params,metadata,res) {
  TourCategory.find({ principal:true, type : {'!' : 'rate'}}).populate('tours',{ visible : true }).exec(function(e,categories) {
    TourCategory.find({ principal : { '!' : true }, type : {'!' : 'rate'}}).populate('tours',{ visible : true }).exec(function(e,sec_categories){
      TourCategory.find({ principal : { '!' : true }, type : 'rate' }).populate('tours',{ visible : true }).exec(function(e,rate_categories){
        formatRateCategories(rate_categories,function(rc){

          var data = {
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
          };
          data.meta.metadata = metadata;

          res.view('home/resultados',data);//res


        });//format categories
      });//rates
    })//subcategories
  });//principal categories
}
