/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/nFtFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    controller : 'home',
    action : 'index'
  },
  '/tours': {
    controller : 'home',
    action : 'resultados_l'
  },
  '/tours/:url': {
    controller : 'home',
    action : 'resultados'
  },
  '/tour/:url': {
    controller : 'tour',
    action : 'index'
  },
  '/reserva': {
    controller : 'reserva',
    action : 'index'
  },
  '/cuenta': {
    controller : 'cuenta',
    action : 'index',
  },
  '/tour_list' : {
      controller : 'home',
      action : 'tour_list'
  },
  '/hotels' : {
      controller : 'home',
      action : 'hotel_list'
  },
  '/tour_categories':{
    controller: 'home',
    action: 'tour_categories'
  },
  '/quienessomos' : {
    controller : 'home'
    ,action : 'quienessomos'
  },
  '/preguntasfrecuentes' : {
    controller : 'home'
    ,action : 'preguntasfrecuentes'
  },
  '/aviso-de-privacidad' : {
    controller : 'home'
    ,action : 'avisodeprivacidad'
  },
  '/login':{
    controller: 'auth',
    action: 'process'
  },
  '/logout':{
    controller: 'auth',
    action: 'logout'
  },
  '/login_fb':{
    controller: 'auth',
    action: 'process_fb'
  },
  '/fb_callback':{
    controller: 'auth',
    action: 'fb_callback'
  },
  '/register':{
    controller: 'client',
    action: 'create'
  },
  '/tours_search': {
    controller: 'home',
    action: 'toursSearchByName'
  },
  '/process' : {
    controller : 'reserva',
    action : 'create'
  },
  '/voucher': {
    controller: 'reserva',
    action: 'voucher'
  },
  '/contacto':{
    controller: 'contact',
    action: 'index'
  },
  '/contact/send':{
    controller: 'contact',
    action: 'send'
  },
  '/recover_password': {
    controller: 'client',
    action: 'recover_password'
  },
  '/send_password_recovery': {
    controller: 'client',
    action: 'send_password_recovery'
  },
  '/change_password': {
    controller: 'client',
    action: 'change_password'
  },
  '/change_password_message': {
    controller: 'client',
    action: 'change_password_message'
  },
  '/update_password': {
    controller: 'client',
    action: 'update_password'
  },
  '/setUrl' : {
    controller : 'home',
    action : 'setUrl'
  },
  '/paypal_return' : {
    controller : "reserva",
    action : 'paypal_return'
  }


  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
