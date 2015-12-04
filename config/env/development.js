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
  facebook_callback: 'http://localhost:1337/fb_callback'
};

  process.env.BACKEND_URL= 'https://admincancunwatertours.herokuapp.com';
  process.env.CONEKTA_API_PRIVATE= 'key_AhumvqfkFZ4LYNwUtvKyfA';
  process.env.CONEKTA_API_PUBLIC= 'key_KA6smKzckK59jwiQrdvnHCA';
  process.env.PAYPAL_CLIENT_ID= 'ATBbxHu2GXZKnNd7qU6JR8U3fNnSbEGNOwv6csod7QyjLbDrA18LSMUM8Y0skqCjTHzVV1_ZDQoM-KF0';
  process.env.PAYPAL_CLIENT_SECRET= 'EHnPHdMyLK2canYqntNbMGo_y2Wy-xQ2wlfHPQs0a3LIwGa51ND-mxgoDfX7xw87p61kamk4Gw0Dme-k';
  process.env.company_id= '54741dc00644662f63ca9ff2';
  process.env.user_id= '54741dc00644662f63ca9ff3';
