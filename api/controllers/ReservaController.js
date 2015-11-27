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
        console.log(params.items);
        if (!params.items) {
          params.items = [{
            name: "item testing",
            id: "",
            price: 1.00,
            currency: "USD",
            quantity: 1
          }];
        }
        //console.log(params);
        OrderCore.createOrder(function(order) {
          console.log(order);
          OrderCore.createReservations(order,items,function(reservations){
            if (reservations) {
              var items =
              Payments.paypalCreate(items,"order=" + order.id,function(result) {
                //Common.updateRese
                console.log(result);
                if (result.success) {
                  OrderCore.updateReservations(order.id,{ autorization_code : result.payment_id,autorization_code_2 : result.payer_id },function(updateRes) {
                    if (updateRes)
                      return res.redirect(result.redirect_url,302);
                  });
                } else {
                  res.view('reserva/voucher',{
                    order : order,
                    error : result.error,
                    meta : {
                      controller : 'home.js'
                    },
                    page : {
                      searchUrl : '/voucher',
                      placeholder : 'Voucher'
                    }
                  });
                }
              });
            } else { //error al guardar reservaciones
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
            }

          })
        });


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
    }

};

