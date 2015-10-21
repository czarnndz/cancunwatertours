/**
 * HomeController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req,res){
    TourCategory.find().exec(function(e,categories){
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
          addMenu: true,
          categories : categories
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
      var s = {};
      var query = {};
      var pageSize = 20;

      if( params.term && params.term != '' ){
          s = { name : new RegExp(params.term,"i") };
      }
      if (params.page){
          query.skip = pageSize * (params.page - 1);
      }
      if(params.minFee && params.maxFee){
        query.fee = { '>=' : params.minFee};
        query.fee = { '<=' : params.maxFee};
      }

      query.sort = 'name_es asc';

      Tour.find(query).limit(20).exec(function(e,tours){
          if (e) {
              console.log(e);
              throw e;
          }
          res.json( Common.formatTours(tours,'es'/*req.getLocale()*/) );
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
      TourCategory.find().exec(function(e,categories){
          if (e) {
              console.log(e);
              throw e;
          }
          res.json({categories:categories});
      });
  }
};

