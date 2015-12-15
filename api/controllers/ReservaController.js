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
                var currencyCode = "USD";//sails.config.company.exchange_rates[params.currency].currency_code;
                var total = 395.22;
                if (params.client.payment_method == 'paypal') {
                  var paypalItems = OrderCore.getItems(reservations,currencyCode);
                  Payments.paypalCreate(paypalItems,"order=" + order.id,total,currencyCode,function(result) {
                    //Common.updateRese
                    if (result.success) {
                      OrderCore.updateReservations(order.id,{ autorization_code : result.payment_id,autorization_code_2 : result.payer_id },function(updateRes) {
                        if (updateRes)
                          return res.json(result);
                        else {
                          result.success = false;
                          result.error = 'reservation error';
                          result.extra = updateRes;
                          return res.json(result);
                        }
                      });
                    } else {
                      OrderCore.updateReservations(order.id,{ state : 'error' },function(updateRes) {
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
    paypalExecute : function(req,res) {
      var params = req.params.all();
      var error = false;
      console.log(params.order);
      if (params.success) {
        error = false;
      }
      res.view('reserva/voucher',{
        order : order,
        error : { message : 'error message' },
        meta : {
          controller : 'home.js'
        },
        page : {
          searchUrl : '/voucher',
          placeholder : 'Voucher'
        }
      });
    },

    voucher: function(req, res){
      res.view();
    }

};

