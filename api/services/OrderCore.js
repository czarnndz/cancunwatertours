/*
	Create section
		create order
		create reservations transfers and tours/hotels
*/
module.exports.createOrder = function(client,callback){
    var params = {};
    params.user =  process.env.user_id;
    params.company = process.env.company_id;
    params.reservation_method = 'web';
    params.reservations = [];

    if (client.id) {
      params.client = client.id;
      Order.create(params).exec(function(err,res){
        if (err) {
          console.log(err);
          callback(false);
        }
        callback(res);
      });
    } else {
      client.user = process.env.user_id;
      client.company = process.env.company_id;
      client.source = 'external';
      Client_.create(client).exec(function(err,res){
        if (!res) {
          console.log(err);
          callback(false);
        }
        params.client = res.id;
        Order.create(params).exec(function(err,res1){
          if (err) {
            console.log(err);
            callback(false);
          }
          callback(res1);
        });
      })
    }

};

module.exports.updateReservations = function(query,attributes,callback) {
  Reservation.update(query,attributes,function(err,ress){
    if (err) {
      console.log(err);
      callback(false);
    }
    callback(ress);
  })
}

module.exports.createReservations = function(order,items,payment_method,currency,callback){
	Order.findOne(order).populate('company').populate('user').exec(function(err,theorder){
		if(_.isUndefined(theorder) || err) callback(err,false);
		async.mapSeries( items, function(item,cb) {
      var newItem = {};
      newItem.order = theorder.id;
      newItem.company = theorder.company.id;
      newItem.user = theorder.user.id;
      newItem.payment_method = payment_method;
      newItem.currency = currency;
      newItem.quantity = 1;
      newItem.reservation_type = 'tour';
      newItem.reservation_method = 'web';
      newItem.state = 'pending';
      newItem.startDate = item.date;
      newItem.schedule = item.schedule;
      newItem.hotel = item.hotel;

      getPriceTour(item,currency,theorder.company,function(err,tour){
        if(err) callback(err,false);

        newItem.pax = tour.adults;
        newItem.kidPax = tour.kids;
        newItem.fee = tour.fee;
        newItem.feeKids = tour.feeChild;
        newItem.fee_adults_base = tour.fee_base;
        newItem.fee_kids_base = tour.feeChild_base;
        newItem.fee_adults = tour.fee;
        newItem.fee_kids = tour.feeChild;
        newItem.commission_sales = tour.commission_sales;
        newItem.exchange_rate_sale = _.isUndefined(theorder.company.exchange_rates[currency]) ? 1 : theorder.company.exchange_rates[currency].sales;
        newItem.exchange_rate_book = _.isUndefined(theorder.company.exchange_rates[currency]) ? 1 : theorder.company.exchange_rates[currency].book;
        newItem.exchange_rate_provider = tour.provider ? tour.provider.exchange_rate : 0;
        newItem.tour = tour.id;
        Reservation.create(newItem).exec(function(err,r){
          //console.log("result ");
          //console.log(r);
          //console.log(err);
          if(err) cb(err,false);
          Reservation.findOne(r.id).populate('tour').exec(function(errr,reservation){
            console.log(reservation);
            cb(errr,reservation);
          });
        });
			});
		},callback);
	});
};

module.exports.getTotal = function(reservations) {
  var total = reservations.reduce(function(tot,r){
    tot += (r.fee + (r.feeKids ? r.feeKids : 0));
    return tot;
  },0.0);
  return total;
};

module.exports.getCurrency = function(currency_id) {
  var currency = _.find(sails.config.company.currencies,function(c){
    return (c.id == currency_id);
  });
  return currency.currency_code;
}



function getPriceTour(item,currency,company,callback){
  var exchange_rate = getCurrencyValue(company.base_currency,currency,company.exchange_rates);
  Tour.findOne(item.id).exec(function(err,tour){
    if (_.isUndefined(tour) || err) {
      console.log(err);
      callback("tour not found",false);
    }
    var aux = {};
    aux.fee_base = tour.fee * item.adults;
    aux.feeChild_base = (tour.feeChild ? tour.feeChild : tour.fee) * item.kids;
    aux.fee = (tour.fee * item.adults * exchange_rate);
    aux.feeChild = (tour.feeChild ? tour.feeChild : tour.fee) * item.kids * exchange_rate;
    aux.commission_sales = tour.commission_sales;
    aux.provider = tour.provider;
    aux.adults = item.adults;
    aux.kids = item.kids;
    aux.id = tour.id;
    callback(false,aux);
  });

};

function getCurrencyValue(base_currency,currency,exchange_rates){
  if (currency == base_currency) {
    return 1;
  } else {
    return exchange_rates[currency].sales;
  }
}

