/**
 * User_preferences.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */
module.exports = {
    attributes: {
        name	: { type: 'string',required : true },
        phone	: { type: 'string' },
        address	: { type: 'string' },
        use : {
            model : 'Client_',
            dominant : true
        }
    }
};