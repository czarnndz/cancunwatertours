/**
* Order.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	attributes: {	
		client : {
			model : 'client_',
		},
		reservations : {
			collection : 'reservation',
			via : 'order'
		}
	}
  	,migrate : "safe"
}