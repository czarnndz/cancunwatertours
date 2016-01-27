/**
 * Client.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */
var bcrypt = require('bcrypt');
module.exports = {

  attributes: {
    name	: { type: 'string',required : true },
    last_name : { type : 'string' },
    phone	: { type: 'string' },
    mobilephone : { type: 'string' },
    email : {
     type: 'string',
     unique: true
    },

    company	: { model : 'Company'  },
    address	: { type: 'string' },
    rfc     : { type : 'string' },
    user : { model : 'User'  },  //usuario que crea este usuario

    source : {
      type : 'string',
      enum : ['internal','external'],
      defaultsTo : 'internal'
    },
    comments : { type : 'string' },

    contacts : {
      collection : "Client_contact",
      via : "client"
    },
    discount : {
      type : 'float'
    },
    city : {
      type : 'string'
    },
    state : {
      type : 'string'
    },
    country : {
      type : 'string'
    },
    password : {
      type : 'string'
    },
    facebookId: {
      type: 'string'
    },
    gender:{
      type:'string'
    },
    birthday: {
      type: 'date'
    }
    ,setPassword : function(val,cb){
      this.password = bcrypt.hashSync(val,bcrypt.genSaltSync(10));
      this.save(cb);
    }
  }
  , attrs_labels : {
    name : { es : 'Nombre' , en : 'Name' }
    ,address : { es : 'Dirección' , en : 'Address' }
    ,rfc : { es : 'RFC' , en : 'RFC' }
    ,phone : { es : 'Teléfono' , en : 'Phone' }
    ,city : { es : 'Ciudad' , en : 'City' }
    ,state : { es : 'Estado' , en : 'State' }
    ,country : { es : 'País' , en : 'Country' }
    ,comments : { es : 'Comentarios' , en : 'Comments' }
  }
  ,labels : {
    es : 'Clientes'
    ,en : 'Clients'
  }

};

