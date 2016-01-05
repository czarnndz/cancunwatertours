/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files.)
 */



// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [
  'bower_components/angular/*.min.css',
  'bower_components/angular-material/*.min.css',
  'bower_components/slick-carousel/slick/slick.css',
  'bower_components/slick-carousel/slick/slick-theme.css',
  'bower_components/leaflet/dist/leaflet.css',
  'bower_components/leaflet.markerclusterer/dist/MarkerCluster.Default.css',
  'bower_components/leaflet.markerclusterer/dist/MarkerCluster.css',
  'bower_components/perfect-scrollbar/min/perfect-scrollbar.min.css',
  //'bower_components/bootstrap/dist/css/*.min.css',
  'styles/**/*.css',
];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [

  // Load sails.io before everything else
  'js/dependencies/sails.io.js',

  // Dependencies like jQuery, or Angular are brought in here
  'bower_components/jquery/dist/*.min.js',
  'js/dependencies/**/*.js',
  'bower_components/angular/*.min.js',
  'bower_components/hammerjs/*.min.js',
  'bower_components/angular-aria/*.min.js',
  'bower_components/angular-animate/*.min.js',
  'bower_components/angular-material/*.min.js',
  'bower_components/livereload-js/dist/*.js',
  'bower_components/slick-carousel/slick/slick.min.js',
  'bower_components/angular-slick/dist/slick.min.js',
  'bower_components/leaflet/dist/leaflet.js',
  'bower_components/leaflet.markerclusterer/dist/leaflet.markercluster.js',
  'bower_components/leaflet-plugins/layer/tile/Google.js',
  'bower_components/angular-leaflet/dist/angular-leaflet-directive.js',
  'bower_components/perfect-scrollbar/min/perfect-scrollbar.min.js',
  'bower_components/angular-perfect-scrollbar/src/angular-perfect-scrollbar.js',
  'bower_components/angular-local-storage/dist/angular-local-storage.min.js',
  'bower_components/angular-lazy-img/release/angular-lazy-img.js',
  'https://conektaapi.s3.amazonaws.com/v0.3.2/js/conekta.js',

  // All of the rest of your client-side js files
  // will be injected here in no particular order.
  'js/**/*.js'
];


// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
var templateFilesToInject = [
  'templates/**/*.html'
];



// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});
module.exports.jsFilesToInject = jsFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});
module.exports.templateFilesToInject = templateFilesToInject.map(function(path) {
  return 'assets/' + path;
});
