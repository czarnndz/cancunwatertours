var fs = require('fs');
var rootPath = process.cwd();
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
    },

    ssl:{
      key: fs.readFileSync(rootPath + '/config/ssl/server.key'),
      cert: fs.readFileSync(rootPath + '/config/ssl/191c2efd36887f4.crt')
    },
    policies: {
      '*': 'isHTTPS'
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

};

