app.filter('toursByCategory', function($q) {
  return function(list,filters) {
    //console.log('filters');
    //console.log(filters);
    var auxList = [];
    var auxList2 = [];
    var auxList3= [];
    if (filters.length) {
      /*angular.forEach(list,function(item){
        angular.forEach(filters,function(filter){
          angular.forEach(filter.tours,function(itemL){
            if (itemL.id == item.id) {
              if (!angular.isUndefined(filter.type) && filter.type == 'rate') {
                if (itemL.value <= filter.value) {
                  this.push(item);
                }
              } else
                this.push(item);
            }
          },auxList3);
          //console.log(auxList3);
          angular.extend(this,auxList3);
        },auxList2);
        angular.extend(this,auxList2);
      },auxList);*/
      angular.forEach(list,function(item){
        angular.forEach(filters,function(filter){
          angular.forEach(filter.tours,function(itemL){
            if (itemL.id == item.id) {
              if (!angular.isUndefined(filter.type) && filter.type == 'rate') {
                item.value = itemL.value;
                if (itemL.value <= filter.value)
                  this.push(true);
                else
                  this.push(false);
                }
                if (!angular.isUndefined(filter.type) && filter.type == 'price') {
                    item.value = itemL.total_price;
                    if (itemL.total_price <= filter.value)
                        this.push(true);
                    else
                        this.push(false);
                }
              else
                this.push(true);
            }else
              this.push(false);
          },auxList3);
          if( auxList3.indexOf(true) >= 0 )
            this.push(true);
          else
            this.push(false);
          auxList3 = [];
        },auxList2);
        if( auxList2.indexOf(false) == -1 )
          this.push(item);
        auxList2 = [];
      },auxList);
    } else {
      auxList = list;
    }

    //console.log(auxList);
    return auxList;
  };

  function intersect(a, b) {
    //var deferred = $q.defer();
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    a.filter(function (e) {
      if (b.indexOf(e) !== -1) return true;
    });
    //deferred.resolve(a);
    return a;//deferred.promise;
  }
});
