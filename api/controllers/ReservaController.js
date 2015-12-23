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
      //console.log(params);
      if (params && params.client && params.items.length && params.currency) {
        OrderCore.createOrder(params.client,function(order) {
          if (order) {
            OrderCore.createReservations(order.id,params.items,params.client.payment_method,params.currency,function(err,reservations){
              if (err) {
                var result = {};
                result.success = false;
                result.error = 'create reservation error';
                result.extra = err;
                return res.json(result);
              }

              if (reservations) {
                var currencyCode = OrderCore.getCurrency(params.currency);//sails.config.company.exchange_rates[params.currency].currency_code;
                var total = OrderCore.getTotal(reservations);
                if (params.client.payment_method == 'paypal') {
                  var paypalItems = OrderCore.getItems(reservations,currencyCode);
                  Payments.paypalCreate(paypalItems,"order=" + order.id,total,currencyCode,function(result) {
                    //Common.updateRese
                    if (result.success) {
                      OrderCore.updateReservations({order : order.id},{ authorization_code : result.payment_id,authorization_code_2 : result.payer_id },function(updateRes) {
                        if (updateRes) {
                          delete result.payment_id;
                          delete result.payer_id;
                          return res.json(result);
                        }
                        else {
                          result.success = false;
                          result.error = 'reservation error';
                          result.extra = updateRes;
                          return res.json(result);
                        }
                      });
                    } else {
                      OrderCore.updateReservations({order : order.id},{ state : 'error' },function(updateRes) {
                        result.success = false;
                        result.error = 'reservation error';
                        result.extra = updateRes;
                        console.log(result);
                        return res.json(result);
                      });
                    }
                  });
                }  else {
                  var result = {};
                  result.success = false;
                  result.error = 'error';
                  return res.json(result);
                }
              } else { //error al guardar reservaciones
                return res.json({ success : false , error : 'error' });
              }

            })
          }
        });
      }
    },
    paypal_return : function(req,res) {
      var params = req.params.all();
      var state = 'canceled';
      var error = true;
      if (params.success) {
        state = 'liquidated';
        error = false;
      }
      OrderCore.updateReservations({ order : params.order,authorization_code_2 : params.token },{ state : state },function(result){
        res.redirect('/voucher?s=' + error + '&o=' + params.order);
      });
    },

    voucher: function(req, res){
        var params = req.params.all();
        console.log(params);
        Order.findOne({ id : params.o }).populate('client').exec(function(err,theorder){
            Reservation.find({ order : params.o }).populate('tour').exec(function(err,thereservations){
                console.log(theorder);
                console.log(thereservations);
                res.view({
                    theorder : theorder,
                    reservations : thereservations,
                    company : sails.config.company,
                    error : params.s,
                    meta : {
                        controller : 'reserva.js'
                    },
                    page : {
                        searchUrl : '/voucher',
                        placeholder : 'Voucher'
                    }
                });
            });
        });
    }

};


