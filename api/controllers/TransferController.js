/**
 * TransferController
 *
 * @description :: Server-side logic for managing transfers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index: function (req, res) {
		Transfer.find().sort('name').exec(function(e,services){
			res.view({
				services : services,
				airports : [],
				meta : {
					//controller : 'hotels.js',
				},
				page : {
					searchUrl : '/hotel/',
					placeholder : 'Busca Hoteles, Tours o Circuitos',
					menuselected : 'transfer'
				}
			});
		});
	},
  	generateOrder : function(req,res){
		var params = req.params.all();
		if( params.client_ ){
			Client_.create(params.client_).exec(function(err,client_){
			  if(err) return res.json('false1');
			  if( client_ && params.reservation ){
			  	Order.create({}).exec(function(err,order){
			        if(err) return res.json('false2');
				  	params.reservation.state = 'pending';
				  	params.reservation.payment_method = 'paypal';
				  	params.reservation.transfer = params.reservation.service.id;
				  	params.reservation.client = client_.id;
				  	params.reservation.arrival_time = '';
				  	params.reservation.arrivalpickup_time = '';
				  	params.reservation.departure_time = '';
				  	params.reservation.departurepickup_time = '';
				  	params.reservation.order = order.id;
			        Reservation.create(params.reservation).exec(function(err,reservation){
			        	if(err) return res.json('false3');
			        	return res.json({ 'order' : order , 'reservation':reservation , 'client_' : client_ });
			        });
			    });
			  }
			});
		}
	},
	createOrder : function(req,res){
		var params = req.params.all();
		Order.create({}).exec(function(err,order){
			return res.json(order);
		});
	},
	getAirports : function(req,res){
		var params = req.params.all();
		console.log(params);
		if(params.location){
			Airport.find({'location' : params.location}).sort('name').exec(function(err,airports){
				return res.json(airports);
			});
		}
	},
	getPrice : function(req,res){
		var params = req.params.all();
		if(params.zone1 && params.zone2 && params.transfer && params.type ){
			TransferPrice.findOne({ 
				"$or":[ { 
					"$and" : [{'zone1' : params.zone1, 'zone2' : params.zone2}] , 
					"$and" : [{'zone1' : params.zone2, 'zone2' : params.zone1}] 
				}] ,
				"transfer" : params.transfer }).exec(function(err,price){
				if(price){
					return res.json(price);
				}else{
					return res.json(false);
				}
			});
		}else{
			return res.json(false);
		}
	}
};

