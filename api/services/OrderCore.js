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
                    newItem.includesTransfer = tour.haveTransfer;
                    newItem.number = Math.floor(Math.random() * (5000 - 2000)) + 2000;
                    newItem.tour = tour.id;

                    Reservation.create(newItem).exec(function(err,r){
                        if(err) {
                          console.log(err);
                          cb(err,false);
                        }
                        if (!newItem.includesTransfer && newItem.hotel) {
                            //new transfer reservation
                            item.zone = tour.zone;
                            //console.log(item);
                            getPriceTransfer(item,currency,theorder.company,function(err,transfer_price){
                                var transferItem = {};
                                transferItem.order = theorder.id;
                                transferItem.company = theorder.company.id;
                                transferItem.user = theorder.user.id;
                                transferItem.payment_method = payment_method;
                                transferItem.currency = currency;
                                transferItem.quantity = transfer_price.quantity;
                                transferItem.reservation_type = 'transfer';
                                transferItem.reservation_method = 'web';
                                transferItem.state = 'pending';
                                transferItem.startDate = item.date;
                                transferItem.hotel = item.hotel;
                                transferItem.fee = transfer_price.fee;
                                transferItem.origin = 'hotel';
                                transferItem.transfer_type = '3';
                                transferItem.reservation_status = 'N';
                                transferItem.pax = parseInt(item.adults) + parseInt(item.kids);
                                transferItem.tour = tour.id;
                                transferItem.transfer = transfer_price.transfer.id;
                                transferItem.transferprice = transfer_price.id;
                                Reservation.create(transferItem).exec(function(error,tr) {
                                    if (error) {
                                        console.log(error);
                                        cb(error, false);
                                    }

                                    var reservations = [ ];
                                    Reservation.findOne(r.id).populate('tour').exec(function(errr,reservation_tour){
                                        //console.log(reservation_tour);
                                        reservations.push(reservation_tour);
                                        Reservation.findOne(tr.id).populate('transfer').exec(function(errr,reservation_transfer){
                                            reservations.push(reservation_transfer);
                                            cb(false,reservations);
                                        });
                                    });
                                });
                            });
                        } else {
                            Reservation.findOne(r.id).populate('tour').exec(function(errr,reservation){
                                //console.log(reservation);
                                cb(errr,reservation);
                            });
                        }

                    });


                  });
            },function(err,results){
                if (err) {
                    console.log(err);
                    callback(err,false);
                } else {
                    var auxArray = _.flatten(results);
                    callback(err,auxArray);
                }

            });
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
};

module.exports.sendNewReservationEmail = function(order_id,lang,callback) {
    Order.findOne(order_id).populate('reservations').populate('client').exec(function(err,order){
        if (err) {
            callback(err,false);
        }
        var head = {
            to : order.client.email,
            subject : lang == 'en' ? 'New reservation from Cancun Watertours' : 'Nueva reservacion de Cancun Watertours',
            bcc : 'admin@spaceshiplabs.com'
        };
        console.log(order);
        console.log(head);

        sails.hooks.email.send(
            "newReservation-" + lang, order, head,
            function(err) {
                if(err){
                    console.log("email error!!!");
                    console.log(err);
                    callback(true,false);
                }else{
                    callback(false,true);
                }
            }
        );
    });
}

function getPriceTour(item,currency,company,callback){
  var exchange_rate = getCurrencyValue(company.base_currency,currency,company.exchange_rates);
  Tour.findOne(item.id).exec(function(err,tour){
    if (_.isUndefined(tour) || err) {
      console.log(err);
      callback("tour not found",false);
    }
    var aux = {};
    if (tour.priceType == 'group') {
        aux.fee_base = tour.fee;
        aux.feeChild_base = 0;
        aux.fee = tour.fee * exchange_rate;
        aux.feeChild = 0;
    } else {
        aux.fee_base = tour.fee * item.adults;
        aux.feeChild_base = (tour.feeChild ? tour.feeChild : tour.fee) * item.kids;
        aux.fee = (tour.fee * item.adults * exchange_rate);
        aux.feeChild = (tour.feeChild ? tour.feeChild : tour.fee) * item.kids * exchange_rate;
    }

    aux.commission_sales = tour.commission_sales;
    aux.provider = tour.provider;
    aux.adults = item.adults;
    aux.kids = item.kids;
    aux.haveTransfer = item.haveTransfer;
    aux.zone = tour.zone;
    aux.duration = item.duration;
    aux.id = tour.id;
    callback(false,aux);
  });

};

function getPriceTransfer(item,currency,company,callback) {
    var exchange_rate = getCurrencyValue(company.base_currency,currency,company.exchange_rates);
    Hotel.findOne({ id : item.hotel.id }).exec(function(e,hotel){
        TransferPrice.findOne({ or : [ { zone1 : item.zone , zone2 : hotel.zone } ,{ zone2 : item.zone , zone1 : hotel.zone } ],active : true }).populate('transfer').exec(function(er,transferPrice){
            var aux = {};
            var quantity = Math.ceil((parseInt(item.adults) + parseInt(item.kids)) / transferPrice.transfer.max_pax);
            if (transferPrice.transfer.service_type == 'C') {
                aux.fee_base = transferPrice.round_trip * quantity;
                aux.feeChild_base = 0;
            } else {
                aux.fee_base = transferPrice.round_trip * item.adults;
                aux.feeChild_base = (_.isUndefined(transferPrice['round_trip_child']) ? transferPrice.round_trip : transferPrice.round_trip_child ) * item.kids;
            }
            aux.fee = aux.fee_base * exchange_rate;
            aux.feeChild = aux.feeChild_base * exchange_rate;
            aux.adults = item.adults;
            aux.kids = item.kids;
            aux.id = transferPrice.id;
            aux.transfer = transferPrice.transfer;
            aux.quantity = quantity;
            callback(false,aux);

        });
    });
};

function getCurrencyValue(base_currency,currency,exchange_rates){
  if (currency == base_currency) {
    return 1;
  } else {
    return exchange_rates[currency].sales;
  }
};

