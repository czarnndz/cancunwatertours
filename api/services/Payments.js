var conekta = require('conekta');
var paypal = require('paypal-rest-sdk');

function initPaypal() {
  paypal.configure({
    'mode': process.env.environment == 'production' ? 'live' : 'sandbox', //sandbox or live
    'client_id': process.env.PAYPAL_CLIENT_ID,
    'client_secret': process.env.PAYPAL_CLIENT_SECRET
  });
}


module.exports.conektaCreate = function(items,client,token,reference_id,total,currency,callback) {
  conekta.api_key = process.env.CONEKTA_API_PRIVATE;
  conekta.locale = 'es';

  var conektaRequest = {
      description: 'Water tours reservation',
      amount: (total * 100).toFixed(),
      currency: currency,
      reference_id: reference_id,
      card: token,
      details: {
          name : client.name,
          email: client.email,
          phone : client.phone,
          line_items : items,
          billing_address : {
              street1 : client.address,
              city : client.city,
              state : client.state,
              zip : client.zipCode,
              country : client.country
          }
      }
  };

  conekta.Charge.create(conektaRequest, function(err, res) {
    console.log('request done');
    if (err) {
      console.log(err.message_to_purchaser);
      return;
    }
    callback(err,res.toObject());
  });
}

module.exports.paypalCreate = function(items,return_param,total,currency,callback){
  initPaypal();
  //console.log(currency);
  var payment = {};
  payment.intent = "sale";
  payment.payer = { payment_method : "paypal" };
  payment.redirect_urls = {
      return_url: process.env.FRONTEND_URL + "/paypal_return?success=true&" + return_param,
      cancel_url: process.env.FRONTEND_URL + "/paypal_return?success=false&" + return_param,
  };
  payment.transactions = [];
  payment.transactions.push({
      item_list: {
        items: items
      },
      amount : {
        currency: currency,
        total: total.toFixed(2)
      },
      description : "This is the payment description."
    });

  paypal.payment.create(JSON.stringify(payment), function (error, payment) {
    if (error) {
      console.log(error);
      callback({ error : error });
    } else {
      console.log("Create Payment Response");
      var result = { success : false };
      //console.log(payment);
      for (var index = 0; index < payment.links.length; index++) {
        //Redirect user to this endpoint for redirect url
        if (payment.links[index].rel === 'approval_url') {
          //console.log(payment.links[index].href);
          result.redirect_url = payment.links[index].href;
          result.payment_id = payment.id;
          var aux = result.redirect_url.split('token=');
          result.payer_id = aux[1];
          result.success = true;
        }
      }
      callback(result);
    }
  });


};

module.exports.paypalExecute = function(payer_id,payment_id,amount,currency,callback) {
  var execute = {
    payer_id: payer_id,
    transactions: [{
      amount: {
        currency: currency,
        total: amount
      }
    }]
  };

  paypal.payment.execute(payment_id, JSON.stringify(execute), function (error, payment) {
    if (error) {
      console.log(error.response);
    } else {
      console.log("Get Payment Response");
      console.log(JSON.stringify(payment));
      callback(payment);
    }
  });
};


module.exports.getPaypalItems = function(reservations,currency) {
    return reservations.map(function(r){
        var item = {};
        item.sku = r.id;
        item.name = r.tour.name;
        item.price = (r.fee + (r.feeKids ? r.feeKids : 0)).toFixed(2);
        item.currency = currency;
        item.quantity = r.quantity;
        return item;
    });
};

module.exports.getConektaItems = function(reservations) {
    return reservations.map(function(r){
        var item = {};
        item.sku = r.id;
        item.name = r.tour.name;
        item.description = " for " + r.pax + " adults" + (r.kidPax ? (" , " + r.kidPax + " kids") : "");
        item.unit_price = ((r.fee + (r.feeKids ? r.feeKids : 0)) * 100).toFixed();
        item.quantity = r.quantity;
        item.type = 'tour';
        return item;
    });
};

