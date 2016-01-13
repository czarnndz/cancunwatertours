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
    action : 'index',
    lang: 'es'
  },

  /*---------------------/
    STATIC URLS(NO LANG REQUIRED)
  /*---------------------*/

  '/change_lang':{
    controller: 'home',
    action: 'changeLang'
  },
  '/tour_list' : {
      controller : 'home',
      action : 'tour_list'
  },
  '/tour_categories':{
    controller: 'home',
    action: 'tour_categories'
  },
  '/tours_search': {
    controller: 'home',
    action: 'toursSearchByName'
  },
  '/hotels' : {
      controller : 'home',
      action : 'hotel_list'
  },
  '/contact/send':{
    controller: 'contact',
    action: 'send'
  },
  '/send_password_recovery': {
    controller: 'client',
    action: 'send_password_recovery'
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

  '/process' : {
    controller : 'reserva',
    action : 'create'
  },
  '/voucher': {
    controller: 'reserva',
    action: 'voucher'
  },

  /*------------------/
    TRANSLATED URLS
  /*------------------*/
  '/:lang/booking': {
    controller : 'reserva',
    action : 'index'
  },
  '/:lang/quienessomos' : {
    controller : 'home'
    ,action : 'quienessomos',
    lang:'es'
  },
  '/:lang/about-us' : {
    controller : 'home'
    ,action : 'quienessomos',
    lang: 'en'
  },
  '/:lang/preguntasfrecuentes' : {
    controller : 'home'
    ,action : 'preguntasfrecuentes',
    lang: 'es'
  },
  '/:lang/faq' : {
    controller : 'home'
    ,action : 'preguntasfrecuentes',
    lang: 'en'
  },
  '/:lang/aviso-de-privacidad' : {
    controller : 'home'
    ,action : 'avisodeprivacidad'
  },
  '/:lang/privacy-notice' : {
    controller : 'home'
    ,action : 'avisodeprivacidad',
    lang: 'en'
  },
  '/:lang/contacto':{
    controller: 'contact',
    action: 'index',
    lang: 'es'
  },
  '/:lang/contact':{
    controller: 'contact',
    action: 'index',
    lang:'en'
  },


  /*--------------/
  /*-------------*/


  '/:lang': {
    controller : 'home',
    action : 'index'
  },
  '/:lang/tours': {
    controller : 'home',
    action : 'resultados_l'
  },
  '/:lang/tours/:url': {
    controller : 'home',
    action : 'resultados'
  },
  '/:lang/tour/:url': {
    controller : 'tour',
    action : 'index'
  },
  '/:lang/account': {
    controller : 'cuenta',
    action : 'index',
  },
  '/:lang/change_password': {
    controller: 'client',
    action: 'change_password'
  },
  '/:lang/change_password_message': {
    controller: 'client',
    action: 'change_password_message'
  },
  '/:lang/recover_password': {
    controller: 'client',
    action: 'recover_password'
  },
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
