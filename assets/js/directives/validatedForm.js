 angular.module('watertours')
  .directive('validatedForm', function () {
    return {
      //priority: 1,   // To run before the default `form` directive
      restrict: 'A',
      link: function(scope, element, atts, formController){


        element.bind("submit", function (e) {
          console.log('submit');
          e.preventDefault();

          if(!formController.$valid){
            console.log('invalid');
          }else{
            console.log('valid');
          }


        });
      }
    };
  });
