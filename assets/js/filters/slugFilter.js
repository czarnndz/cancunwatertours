'use strict';
app.filter('slugFilter', function () {
 return function(str) {
    return str.replace(/\s+/g, '-').toLowerCase();
  };
});
