var app = angular.module('watertours',['ngMaterial','leaflet-directive','slick','perfect_scrollbar']);

app.filter('toursByCategory', function() {
  return function(list,filters) {
    console.log(filters);
    var auxList = [];
    angular.forEach(list,function(item){
        if (item) {
          console.log(item);
          this.push(item);
        }
    },auxList);

    return auxList;
  };
});
