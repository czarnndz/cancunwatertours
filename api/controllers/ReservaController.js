/**
 * HomeController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index : function(req,res) {
        var params = req.params.all();
        var callback = function(tour,hotel,hotels) {
            var tour = Common.formatTour(tour,'es');
            res.view({
                tour : tour,
                hotel : Common.formatHotel(hotel,'es'),
                hotels : Common.formatHotel(hotels,'es'),
                meta : {
                    controller : 'reserva.js',
                    params : params
                },
                page : {
                    searchUrl : '/reserva',
                    placeholder : 'Buscar'
                }
            });
        };

        if (params.tour) {
            Tour.findOne({ id : params.tour }).populateAll().exec(function(err,tour){
                if (err) {
                    res.error();
                }
                if (req.params['hotel'] != null) {
                    var hotels = [];
                    Hotel.findOne({ id : params.hotel }).exec(function(err,hotel) {
                        hotels = [];
                        hotels.push(hotel);
                        Hotel.find().exec(function(err,hotels) {
                            callback(tour, hotel, hotels);
                        });
                    });
                } else {
                    Hotel.find().exec(function(err,hotels){
                        callback(tour,null,hotels);
                    });

                }
            })
        } else {
            res.notFound();
        }

    },
    addOrder : function(req,res) {
        var params = req.params.all();

    }

};

