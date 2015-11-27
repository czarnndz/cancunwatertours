/*
	Create section
		create order
		create reservations transfers and tours/hotels
*/
module.exports.createOrder = function(callback){
    var params = {};
    params.user =  process.env.user_id;
    params.company = process.env.company_id;
    params.reservation_method = 'web';
    params.reservations = [];

    Order.create(params).exec(function(err,res){
      if (err) {
        console.log(err);
        callback(false);
      }
      callback(res);
    });
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

module.exports.createReservationTour = function(params,payment_method,currency,callback){
	Order.findOne( params.order ).populate('company').populate('user').exec(function(err,theorder){
		if(err) callback(err,false);
		async.mapSeries( params.items, function(item,cb) {
			item.order = theorder.id;
      item.company = theorder.company.id;
      item.user = theorder.user.id;
      item.payment_method = payment_method;
      item.currency = currency;

			OrderCore.getTourPrices(item.id,theorder.company.id,function(err,tour){
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

module.exports.getTourPrices = function(itemID,company,callback){
	model = model.toLowerCase();
	//el OR 'model' es porque falta hoteles por agencia
	if( company.adminCompany || model == 'hotel' ){
		sails.models[model].findOne(itemID).exec(function(err,theItem){
			callback( err, { item:theItem, agencyProduct: false } );
		});
	}else{
		CompanyProduct.findOne( item[model].id ).exec(function(err,CP){
			sails.models[model].findOne( CP[model].id ).populate('provider').exec(function(err,theItem){
				callback( err, { item:theItem, agencyProduct: CP } );
			});
		});
	}
};

