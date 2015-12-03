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
      Client_.create(client).exec(function(err,res){
        if (err) {
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

module.exports.updateReservations = function(order,attributes,callback) {
  Reservation.update({ order : order },attributes,function(err,ress){
    if (err) {
      console.log(err);
      callback(false);
    }
    console.log(ress);
    callback(ress);
  })
}

module.exports.createReservations = function(order,items,payment_method,currency,callback){
	Order.findOne( order ).populate('company').populate('user').exec(function(err,theorder){
		if(err) callback(err,false);
		async.mapSeries( items, function(item,cb) {
			item.order = theorder.id;
      item.company = theorder.company.id;
      item.user = theorder.user.id;
      item.payment_method = payment_method;
      item.currency = currency;

      getPriceTour(item,theorder.company,function(err,tour){
          if(err) callback(err,false);
					item.fee_adults_base = tour.fee_base;
					item.fee_kids_base = tour.feeChild_base;
					item.fee_adults = tour.fee;
		      item.fee_kids = tour.feeChild;
					item.commission_sales = tour.commission_sales;
	        item.exchange_rate_sale = theorder.company.exchange_rates[item.currency].sales;
	        item.exchange_rate_book = theorder.company.exchange_rates[item.currency].book;
	        item.exchange_rate_provider = tour.provider?tour.provider.exchange_rate:0;
          delete item.id;
          Reservation.create(item).exec(function(err,r){
					  if(err) cb(err,item);
					  item.id = r.id;
					  cb(err,item);
				  });
			});
		},callback);
	});
};

function getPriceTour(item,company,callback){
  Tour.findOne(item.id).exec(function(err,tour){
    if (err) {
      console.log(err);
      callback(false);
    }
    tour.fee_base = tour.fee;

    callback(tour)
  });

};

function getCurrencyValue(base_currency,rated_currency,exchange_rates){

}

