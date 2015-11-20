/**
 * HomeController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index : function(req,res) {
      Hotel.find().exec(function(err,hotels){
        res.view({
          hotels : Common.formatHotel(hotels,'es'),
          meta : {
            controller : 'reserva.js'
          },
          page : {
            searchUrl : '/reserva',
            placeholder : 'Buscar'
          }
        });
      });
    },
    addOrder : function(req,res) {
        var params = req.params.all();

    }

};

