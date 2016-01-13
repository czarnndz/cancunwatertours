/**
 * Order.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
/* campos default : _id, createdAt, updatedAt	*/
module.exports = {
  attributes: {
    /*folio: {
     type: 'integer',
     autoIncrement: true,
     required: true,
     unique: true
     },*/
    reservation_method : {
      type: 'string'
      ,enum: ['intern', 'api', 'rep', 'agencyApi','web'] ,
      required : true
    }
    ,client : {
      model : 'client_',
    }
    ,user : {
      model : 'user'
    }
    ,company : {
      model : 'company'
    }
    ,cuponsingle : {
      model : 'cuponSingle'
    }
    ,cupon : {
      model : 'cupon'
    }
    ,reservations : {
      collection : 'reservation',
      via : 'order'
    }
    ,number : {
        type : 'integer',
        autoIncrement: true
    }
  }
  ,labels : {
    es : 'Reservaciones'
    ,en : 'Reservations'
  }
  ,migrate : "safe"

}
