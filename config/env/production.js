/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

   models: {
     connections: {
         mongodb: {
             adapter   : 'sails-mongo',
             url       : process.env.MONGO_URI || null
         }
     }
   },

   hookTimeout: 600000,

  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

  port: process.env.PORT || 1195,

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  // log: {
  //   level: "silent"
  // }
  facebook_clientID: '974697955910416',
  facebook_clientSecret: '0d2cdb69e932618a7eddad40a6ba4b0c',
  facebook_callback: 'http://cancunwatertours.herokuapp.com/fb_callback',
};

process.env.BACKEND_URL = 'https://admin.cancunwatertours.com';
process.env.FRONTEND_URL = 'https://www.cancunwatertours.com';
process.env.CONEKTA_API_PRIVATE = 'key_AhumvqfkFZ4LYNwUtvKyfA';
process.env.CONEKTA_API_PUBLIC = 'key_KA6smKzckK59jwiQrdvnHCA';
process.env.PAYPAL_CLIENT_ID = 'AV8IhxBeEm4on1cNrw7b7E3tj31WARrnZXj7KbBQzEFWCrY80mg7A3P8tAET';
process.env.PAYPAL_CLIENT_SECRET = 'EJn5ehAu4yAslIMDbux8f_G99OTyB7ZfHXEBC34H3E8Jy1kdolb-sbc-4BK4';
process.env.company_id = '54741dc00644662f63ca9ff2';
process.env.user_id = '54741dc00644662f63ca9ff3';
