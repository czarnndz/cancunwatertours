var app = angular.module('watertours',['ngMaterial','leaflet-directive','slick','perfect_scrollbar']);

app.filter('toursByCategory', function() {
  return function(list,filters) {
    console.log('filters');
    console.log(filters);
    var auxList = [];
    var auxList2 = [];
    var auxList3= [];
    angular.forEach(list,function(item){
      angular.forEach(filters,function(filter){
        angular.forEach(filter.tours,function(itemL){
          if (itemL.id == item.id) {
            this.push(item);
          }
        },auxList3);
        this.concat(auxList3);
      },auxList2);
      this.concat(auxList2);
    },auxList);
    console.log(filters);
    return auxList;
  };
});
