var conekta = require('conekta');

module.exports.ConektaCreate = function(ccType) {
  conekta.api_key = '9YxqfRnx4sMQDnRsqdYn';
  conekta.locale = 'es';

  conekta.Charge.create({
    description: 'Stogies',
    amount: 50000,
    currency: 'MXN',
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

module.exports.paypalCreate = function(){

}

