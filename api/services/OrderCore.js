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
    params.payment_method = client.payment_method;
    params.state = 'pending';

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
  var order = query.order;
  var state = attributes.state || 'pending';

  Order.update({id: order}, {state: state}, function(errOrder, orderUpdated){

    if(errOrder){
      console.log(errOrder);
      callback(false);
    }

    Reservation.update(query,attributes,function(err,ress){
      if (err) {
        console.log(err);
        callback(false);
      }
      callback(ress);
    });

  });

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
              newItem.departurePoint = item.departurePoint;

                  getPriceTour(item,currency,theorder.company,function(err,tour){
                    if(err) callback(err,false);

                    sails.log.debug('Tour en getPriceTour: ' + tour.name);
                    sails.log.debug('Tour haveTransfer: ' + tour.haveTransfer);

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
                    newItem.hasGlobalDiscount = tourHasDiscount(tour.id);
                    newItem.discount = getPercentageDiscount(tour.commission_agency, tour.id);

                    Reservation.create(newItem).exec(function(err,r){
                        if(err) {
                          console.log(err);
                          cb(err,false);
                        }

                        if (!newItem.includesTransfer && newItem.hotel && newItem.transfer) {
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
    var rPrice = (r.fee + (r.feeKids ? r.feeKids : 0));
    tot += rPrice;
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


module.exports.sendNewReservationEmail = function(order_id,lang,req,callback) {
    Order.findOne(order_id).populate('reservations').populate('client').exec(function(err,order){
        if (err) {
            callback(err,false);
        }
        var head = {
            to : order.client.email,
            subject : lang == 'en' ? 'New reservation from Cancun Watertours' : 'Nueva reservacion de Cancun Watertours',
            bcc : 'admin@spaceshiplabs.com'
        };
        //console.log(order);
        //console.log(head);

        order.domainName = req.baseUrl;

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
        aux.fee = calculateDiscount(aux.fee, tour.commission_agency, tour.id);
        aux.feeChild = 0;
    } else {
        aux.fee_base = tour.fee * item.adults;
        aux.feeChild_base = (tour.feeChild ? tour.feeChild : tour.fee) * item.kids;
        aux.fee = (tour.fee * item.adults * exchange_rate);
        aux.feeChild = (tour.feeChild ? tour.feeChild : tour.fee) * item.kids * exchange_rate;


        //Applying discounts(if globaldiscount is active)
        aux.fee = calculateDiscount(aux.fee, tour.commission_agency, tour.id);
        aux.feeChild = calculateDiscount(aux.feeChild, tour.commission_agency, tour.id);
    }

    aux.commission_sales = tour.commission_sales;
    aux.provider = tour.provider;
    aux.adults = item.adults;
    aux.kids = item.kids;
    aux.haveTransfer = item.haveTransfer;
    aux.zone = tour.zone;
    aux.duration = item.duration;
    aux.id = tour.id;
    aux.commission_agency = tour.commission_agency;

    callback(false,aux);
  });

};

function getPriceTransfer(item,currency,company,callback) {
    var exchange_rate = getCurrencyValue(company.base_currency,currency,company.exchange_rates);
    Hotel.findOne({ id : item.hotel.id }).exec(function(e,hotel){

        var query = { or : [ { zone1 : item.zone , zone2 : hotel.zone } ,{ zone2 : item.zone , zone1 : hotel.zone } ],active : true };
        //sails.log.debug('query');
        //sails.log.debug(query);
        TransferPrice.findOne(query).populate('transfer').exec(function(er,transferPrice){
            sails.log.debug('transferPrice');
            sails.log.debug(transferPrice);
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


function calculateDiscount(price, commission, tourId){
  var result = price;
  var discPercent = getPercentageDiscount(commission, tourId);

  if( tourHasDiscount(tourId) ){
    if(discPercent > 0){
      result = price - ( price * (discPercent / 100) );
    }
    else if (commission && parseFloat(commission) > 40){
      discPercent = 25;
      result = price - ( price * (discPercent / 100) );
    }
  }
  return result;
}

function tourHasDiscount(tourId){
  var result = true;
  var exceptions = [
    '558dc7e368b4f41b1a39b75f', //Xcaret basico
    '547d015533b3bf00659e057d', //Xcaret Plus
  ];
  if( !sails.config.company.isActiveGlobalDiscount  || exceptions.indexOf(tourId) > -1 ){
    result = false;
  }
  return result;
}

function getPercentageDiscount(commission, tourId){
  var percentage = 0;
  var discountTable = {
    '10': 5,
    '15': 10,
    '20': 10,
    '25': 15,
    '30': 15,
    '35': 20,
    '40': 20,
    '45': 25,
    '50': 25
  };
  if(tourHasDiscount(tourId) ){
    if(discountTable[commission]){
      percentage = discountTable[commission];
    }
    else if (commission && parseFloat(commission) > 40){
      percentage = 25;
    }
  }
  return percentage;
}


module.exports.calculateDiscount = calculateDiscount;
module.exports.getPercentageDiscount = getPercentageDiscount;
module.exports.tourHasDiscount = tourHasDiscount;
