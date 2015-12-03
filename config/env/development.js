/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMongodbServer'
  // }
//  models : {
//      connections : {
//          mongodb: {
//              adapter   : 'sails-mongo',
//              url       : process.env.MONGO_URI || null
//          }
//      }
//  }
  facebook_clientID: '975412445838967',
  facebook_clientSecret: '310fcd71a36a13d0bbeddeed73ac56a8',
  facebook_callback: 'http://localhost:1337/fb_callback',
};


process.env.BACKEND_URL = 'https://admincancunwatertours.herokuapp.com';
process.env.CONEKTA_API_PRIVATE = 'key_AhumvqfkFZ4LYNwUtvKyfA';
process.env.CONEKTA_API_PUBLIC = 'key_KA6smKzckK59jwiQrdvnHCA';
process.env.PAYPAL_CLIENT_ID = 'AV8IhxBeEm4on1cNrw7b7E3tj31WARrnZXj7KbBQzEFWCrY80mg7A3P8tAET';
process.env.PAYPAL_CLIENT_SECRET = 'EJn5ehAu4yAslIMDbux8f_G99OTyB7ZfHXEBC34H3E8Jy1kdolb-sbc-4BK4';
process.env.company_id = '54741dc00644662f63ca9ff2';
process.env.user_id = '54741dc00644662f63ca9ff3';

