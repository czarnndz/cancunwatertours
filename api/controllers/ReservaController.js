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
            adults: 1,
            kids : 1
          }];
        }

        OrderCore.createOrder(function(order) {
          console.log(order);
          OrderCore.createReservations(order,params.items,function(reservations){
            if (reservations) {
              Payments.paypalCreate(params.items,"order=" + order.id,function(result) {
                //Common.updateRese
                console.log(result);
                if (result.success) {
                  OrderCore.updateReservations(order.id,{ autorization_code : result.payment_id,autorization_code_2 : result.payer_id },function(updateRes) {
                    if (updateRes)
                      return res.json(result);
                    else {
                      result.success = false;
                      result.error = 'update reservation error';
                      result.extra = updateRes;
                      return res.json(result);
                    }
                  });
                } else {
                  return res.json(result);
                }
              });
            } else { //error al guardar reservaciones
              return res.json({ success : false , error : 'error' });
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
    },

    voucher: function(req, res){
      res.view();
    }

};

