/**
 * HomeController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index : function(req,res) {
      var params = req.params.all();
      var isCartComplete = (params.step == '2') ? true : false;
      Hotel.find().exec(function(err,hotels){
          TransferPrice.find({ active : true}).populate('transfer').exec(function(et,transferPrices) {
              res.view({
                  hotels : Common.formatHotel(hotels,'es'),
                  transfer_prices : transferPrices,
                  booking: true,
                  cartComplete: isCartComplete,
                  meta : {
                      controller : 'reserva.js'
                  },
                  page : {
                      searchUrl : '/booking',
                      placeholder : 'Buscar',

                  }
              });
          });

      });
    },
    create : function(req,res) {
      var params = req.params.all();
      var result = {};
      var lang = req.getLocale() || 'es';
      if (params && params.client && params.items.length && params.currency) {
        OrderCore.createOrder(params.client,function(order) {
          if (order) {
            OrderCore.createReservations(order.id,params.items,params.client.payment_method,params.currency,function(err,reservations){
              //console.log(reservations);
              if (err) {
                console.log(err);
                result.success = false;
                result.error = 'create reservation error';
                result.extra = err;
                return res.json(result);
              } else if (reservations) {
                var currencyCode = OrderCore.getCurrency(params.currency);//sails.config.company.exchange_rates[params.currency].currency_code;
                var total = OrderCore.getTotal(reservations);
                //console.log(total);
                if (params.client.payment_method == 'paypal') {
                  var paypalItems = Payments.getPaypalItems(reservations,currencyCode);
                  Payments.paypalCreate(paypalItems,"order=" + order.id,total,currencyCode,function(result) {
                    //Common.updateRese
                    if (result.success) {
                      OrderCore.updateReservations({order : order.id},{ authorization_code : result.payment_id,authorization_code_2 : result.payer_id },function(updateRes) {
                        if (updateRes) {
                          delete result.payment_id;
                          delete result.payer_id;
                          return res.json(result);
                        } else {
                          result.success = false;
                          result.error = 'reservation update error';
                          result.extra = updateRes;
                          return res.json(result);
                        }
                      });
                    } else {
                      OrderCore.updateReservations({order : order.id},{ state : 'error' },function(updateRes) {
                        result.success = false;
                        result.error = 'reservation update to error';
                        result.extra = updateRes;
                        return res.json(result);
                      });
                    }
                  });
                } else if (params.client.payment_method == 'conekta') {
                      var conektaItems = Payments.getConektaItems(reservations);
                      Payments.conektaCreate(conektaItems,params.client,params.token,order.id,total,currencyCode,function(err,cresult) {
                          if (err) {
                              OrderCore.updateReservations({order : order.id},{ state : 'error' },function(updateRes) {
                                  result.success = false;
                                  result.error = err;
                                  result.extra = updateRes;
                                  //result.redirect_url = '/'+lang+'/voucher?o=' + order.id + '&s=' + 'update_error';
                                  return res.json(result);
                              });
                          }
                          else{
                          //console.log(cresult);
                            OrderCore.updateReservations({order : order.id},{ state : cresult.status == 'paid' ? 'liquidated' : 'pending',authorization_code : cresult.id },function(updateRes) {
                                if (updateRes) {
                                    //console.log(order);
                                    result.success = true;
                                    result.redirect_url = '/'+lang+'/voucher?o=' + order.id;

                                    OrderCore.sendNewReservationEmail(order.id,lang,req,function(err,success){
                                      return res.json(result);
                                    });

                                } else {
                                    result.success = false;
                                    result.error = 'reservation update error';
                                    result.extra = updateRes;
                                    result.redirect_url = '/'+lang+'/voucher?o=' + order.id + '&s=' + 'update_error';
                                    return res.json(result);
                                }
                            });
                          }
                      });
                } else {
                  result.success = true;
                  result.error = 'error payment method not supported';
                  result.redirect_url = '/'+lang+'/voucher?o=' + order.id + '&s=' + 'payment_method';
                  return res.json(result);
                }
              } else { //error al guardar reservaciones
                return res.json({ success : false , error : 'error reservations creation',redirect_url : '/voucher?o=' + order.id });
              }

            })
          } else { //error al guardar la orden
              return res.json({ success : false , error : 'error order creation' });
          }
        });
      } else { //error de parametros de request
          return res.json({ success : false , error : 'error bad request' });
      }
    },
    paypal_return : function(req,res) {
      var params = req.params.all();
      var state = 'canceled';
      var error = true;
      var lang = req.getLocale() || 'es';
      if (params.success) {
        state = 'liquidated';
        error = false;
      }
      OrderCore.updateReservations({ order : params.order,authorization_code_2 : params.token },{ state : state },function(result){
          if (!result) {
              res.forbidden();
          } else {
              if (params.success) {
                  OrderCore.sendNewReservationEmail(params.order,lang,req,function(err,success){
                      result.email_success = success;
                      res.redirect('/'+lang+'/voucher?s=' + error + '&o=' + params.order);
                  });
              } else {
                  res.redirect('/'+lang+'/voucher?s=' + error + '&o=' + params.order);
              }

          }
      });
    },

    conekta_return : function(req,res) { //parece que no hay
        var params = req.params.all();
        var state = 'canceled';
        var error = true;
        var lang = req.getLocale() || 'es';
        if (params.success) {
            state = 'liquidated';
            error = false;
        }
        OrderCore.updateReservations({ order : params.order,authorization_code_2 : params.token },{ state : state },function(result){
            if (!result) {
                res.forbidden();
            } else {
                if (params.success) {
                    OrderCore.sendNewReservationEmail(params.order,lang,function(err,success){
                        result.email_success = success;
                        res.redirect('/'+lang+'/voucher?s=' + error + '&o=' + params.order);
                    });
                } else {
                    res.redirect('/'+lang+'/voucher?s=' + error + '&o=' + params.order);
                }

            }
        });
    },
    //TODO agregar selector por email y id reservation
    voucher: function(req, res){
        var params = req.params.all();
        //console.log(params);
        Order.findOne({ id : params.o }).populate('client').exec(function(err,theorder){
            Reservation.find({ order : params.o }).populate('tour').populate('transfer').exec(function(err,thereservations){
                //console.log(thereservations);
                res.view({
                    theorder : theorder,
                    reservations : thereservations,
                    company : sails.config.company,
                    error : params.s || 'none',
                    meta : {
                        controller : 'reserva.js'
                    },
                    page : {
                        searchUrl : '/' + params.lang +  '/voucher',
                        placeholder : 'Voucher'
                    }
                });
            });
        });
    }

};


