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
		phone	: { type: 'string' },
		address	: { type: 'string' },
        user : { model : 'user' },
    password : {
        type : 'string'
    },
    setPassword : function(val,cb){
      this.password = bcrypt.hashSync(val,bcrypt.genSaltSync(10));
      this.save(cb);
    }
	}
};
