var conekta = require('conekta');
var paypal = require('paypal-rest-sdk');

function initPaypal() {
  paypal.configure({
    'mode': process.env.environment == 'production' ? 'live' : 'sandbox', //sandbox or live
    'client_id': process.env.PAYPAL_CLIENT_ID,
    'client_secret': process.env.PAYPAL_CLIENT_SECRET
  });
}


module.exports.ConektaCreate = function(currency) {
  conekta.api_key = '9YxqfRnx4sMQDnRsqdYn';
  conekta.locale = 'es';

  conekta.Charge.create({
    description: 'Stogies',
    amount: 50000,
    currency: currency,
    reference_id: '9839-wolf_pack',
    card: 'tok_test_visa_4242',
    details: {
      email: 'logan@x-men.org'
    }
  }, function(err, res) {
    if (err) {
      console.log(err.message_to_purchaser);
      return;
    }
    console.log(res.toObject());
  });
}

module.exports.paypalCreate = function(items,return_param,curreny,callback){
  initPaypal();
  var payment = {};
  payment.intent = "authorize";
  payment.payer = { payment_method : "paypal" };
  payment.redirect_urls = {
      return_url: "http://cancunwatertours.herokuapp.com/paypalExecute?success=true&" + return_param,
      cancel_url: "http://cancunwatertours.herokuapp.com/paypalExecute?success=false&" + return_param,
  };
  payment.transactions = [];
  payment.transactions.push({
      item_list: {
        items: items
      },
      amount : {
        currency: currency,
        total: 1.00
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
}

