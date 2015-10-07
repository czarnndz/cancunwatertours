(function () {
    /* ------------------- Cart list ----------------------- */
	var controllercartList = function($scope,$http,ngCart){
        //$scope.object = $scope.object || {};
        $scope.translates = $scope.$parent.translates;
        $scope.ngCart = ngCart;
        $scope.days = [];
        //console.log(ngCart.getCart().items);console.log($scope.ngCart);
        $scope.days[0] =  $scope.translates[28].term;
        $scope.days[1] = $scope.translates[29].term;
        $scope.days[2] = $scope.translates[29].term;
        $scope.days[3] = $scope.translates[30].term;
        $scope.days[4] = $scope.translates[31].term;
        $scope.days[5] = $scope.translates[32].term;
        $scope.days[6] = $scope.translates[33].term;
        $scope.getDate = function(date){
            var result = '';
            var aux = new Date(date);
            result = $scope.days[aux.getDay()] + ', ' + aux.getFullYear() + '-' + aux.getDate() + '-' + (aux.getMonth()+1);
            return result;
        };
        $scope.getIcon = function(item){
            var $cars = ['1.png','2.png','3.png','4.png'];
            var $x = 0;
            var pax = parseInt(item.getData().service.max_pax);
            if( pax > 4 && pax <= 6 ){
              $x = 3;
            }else if( pax > 6 && pax <=12 ){
              $x = 1;
            }
            return '/img/cars/' + $cars[$x];
        };
	};
	controllercartList.$inject = ['$scope','$http','ngCart'];
    var directivecartList = function(){
        return {
            controller : controllercartList,
            restrict : 'E',
            scope : {
            },
            replace : true,
            templateUrl : "/templates/partials/cartList.html"
        };
    };
    app.directive('cartList',directivecartList);
    // ------------------- Cart Sidebar ----------------------- 
    var controllercartSidebar = function($scope,$http,ngCart){
        $scope.object = $scope.object || {};
        $scope.ngCart = ngCart;
        $scope.translates = $scope.$parent.translates;
        console.log('price');
        console.log(ngCart.totalCost());
        //console.log(ngCart.getCart().items);
        $scope.clearCart = function(){
            for( var x in ngCart.getCart().items ){
                ngCart.removeItem(x);
            }
        };
    };
    controllercartSidebar.$inject = ['$scope','$http','ngCart'];
    var directivecartSidebar = function(){
        return {
            controller : controllercartSidebar,
            restrict : 'E',
            scope : {
                object : '='
            },
            replace : true,
            templateUrl : "/templates/partials/cartSidebar.html"
        };
    };
    app.directive('cartSidebar',directivecartSidebar);
    // ------------------- Cart Button ----------------------- 
    var controllerCartButton = function($scope,$http,ngCart,$rootScope){
        $scope.object = $scope.object || {};
        $scope.ngCart = ngCart;
        $scope.translates = $scope.$parent.translates;
        //console.log(ngCart);
        //console.log($scope.data);
        $scope.addItem = function(id,n,p,q,d){
            if( ifOrder() ){
                _addItem(id,n,p,q,d);
            }else{
                //createOrder
                $http.post('/transfer/createOrder',{},{}).success(function(result){
                  result.reservation_type = 'order';
                  //console.log('createOrder');console.log(result);
                  $rootScope.orderID = result.id;
                  //add the order too
                  _addItem(result.id,'order',0.00001,1,result);
                  //add the item
                  _addItem(id,n,p,q,d);
                });
            }
        };
        var _addItem = function(id,n,p,q,d){
            d.orderID = $rootScope.orderID;
            $scope.ngCart.addItem(id,n,p,q,d);
        }
        var ifOrder = function(){
            var items = ngCart.getCart().items;
            var result = false;
            for(var x = 0;x<items.length;x++){
                if (items[x]._data.reservation_type == 'order') return true;
            }
            return result;
        }
    };
    controllerCartButton.$inject = ['$scope','$http','ngCart','$rootScope'];
    var directivecartButton = function(){
        return {
            controller : controllerCartButton,
            restrict : 'E',
            scope : {
                id:'@',
                name:'@',
                quantity:'=',
                price:'=',
                data:'='
            },
            transclude: true,
            templateUrl : "/templates/partials/cartButton.html",
            link:function(scope, element, attrs){
                scope.attrs = attrs;
                scope.inCart = function(){
                    //console.log(scope.data);
                    return scope.ngCart.getItemById(attrs.id);
                }
            }
        };
    };
    app.directive('cartButton',directivecartButton);
    // ------------------- Cart item counter ----------------------- 
    var controllerCartCounter = function($scope,$http,ngCart){
        $scope.object = $scope.object || {};
        $scope.ngCart = ngCart;
    };
    controllerCartCounter.$inject = ['$scope','$http','ngCart'];
    var directivecartCounter = function(){
        return {
            controller : controllerCartCounter,
            restrict : 'E',
            scope : {
                data:'='
            },
            templateUrl : "/templates/partials/cartCounter1.html",
        };
    };
    app.directive('cartCounter',directivecartCounter);
    // ------------------- Cart MobileBar ----------------------- 
    var controllerCartMobileBar = function($scope,$http,ngCart){
        $scope.object = $scope.object || {};
        $scope.ngCart = ngCart;
        $scope.translates = $scope.$parent.translates;
    };
    controllerCartMobileBar.$inject = ['$scope','$http','ngCart'];
    var directivecartMobileBar = function(){
        return {
            controller : controllerCartMobileBar,
            restrict : 'E',
            scope : {
                data:'='
            },
            templateUrl : "/templates/partials/cartMobileBar.html",
        };
    };
    app.directive('cartMobileBar',directivecartMobileBar);
    // ------------------- Cart Resume ----------------------- 
    var controllerCartResume = function($scope,$http,ngCart,$sce,$rootScope){
        $scope.object = $scope.object || {};
        $scope.ngCart = ngCart;
        $scope.isResume = false;
        $scope.hotels = false;
        $scope.tours = [];
        $scope.transfers = [];
        $scope.lang_ = $rootScope.lang_;
        var formatCart = function(){
            if( ngCart.totalItems() === 0 ){
                $scope.isResume = false;
            }else{
                $scope.isResume = true;
                //console.log(ngCart.getCart().items);
                var items = ngCart.getCart().items;
                var hc = 0;
                items.forEach(function(item){
                    if( item.getData().reservation_type == 'hotel' && hc == 0 ){
                        hc++;
                        var date1 = new Date(item._data.startDate),date2 = new Date(item._data.endDate);
                        var aux = item;
                        aux.startDate = date1.getDate() + '/' + (date1.getMonth()+1) + '/' + date1.getFullYear();
                        aux.endDate = date2.getDate() + '/' + (date2.getMonth()+1) + '/' + date2.getFullYear();
                        aux.diffDays = Math.abs(Math.ceil((date1.getTime()-date2.getTime())/86400000));
                        $scope.hotels = aux;
                    }else if( item.getData().reservation_type == 'tour' ){
                        if(item._data.startDate){
                            var date1 = new Date(item._data.startDate);
                            item.startDate = date1.getDate() + '/' + (date1.getMonth()+1) + '/' + date1.getFullYear();
                        }
                        $scope.tours.push(item);
                    }else if( item.getData().reservation_type == 'transfer' ){
                        if(item._data.arrival_date){
                            var date1 = new Date(item._data.arrival_date);
                            item.arrival_date = date1.getDate() + '/' + (date1.getMonth()+1) + '/' + date1.getFullYear();
                        }
                        if(item._data.departure_date){
                            var date2 = new Date(item._data.departure_date);
                            item.departure_date = date2.getDate() + '/' + (date2.getMonth()+1) + '/' + date2.getFullYear();
                        }
                        $scope.transfers.push(item);
                    }
                });
            }
        };
        var getHotelResume = function(){
            var result = '';
            if( $scope.hotels ){
                moment.locale($rootScope.lang_);
                var d = moment($scope.hotels.startDate,'D/M/YYYY');
                //var date = d.format('dddd');
                if( $rootScope.lang_ == 'es' ){
                    var date = d.format('dddd') + ', ' + d.format('D/MMMM/YYYY');
                    result += "El <span class='white'><i class='icon-calendar'></i>" + date + 
                        "</span> (día de llegada) me quedaré en <span class='white'><i class='icon-hoteles'></i>" +
                        $scope.hotels._name + "</span> durante <span class='white'>" + $scope.hotels.diffDays + ($scope.hotels.diffDays>1?' días':' día') + "</span>";
                }else{
                    var date = d.format('dddd') + ', ' + d.format('D/MMMM/YYYY');
                    result += "The <span class='white'><i class='icon-calendar'></i>" + date + 
                        "</span> (arrival date) I will stay in <span class='white'><i class='icon-hoteles'></i>" +
                        $scope.hotels._name + "</span> for <span class='white'>" + $scope.hotels.diffDays + ($scope.hotels.diffDays>1?' days':' day') + "</span>";
                }
                result += $scope.tours.length?' ':'.';
            }
            $scope.hotelResume = $sce.trustAsHtml(result);
        };
        var getTourResume = function(){
            var result = '';
            if( $scope.tours.length ){
                if( $rootScope.lang_ == 'es' ){
                    result += ($scope.hotels?'y c':'C') + "onoceré <span class='white'><i class='icon-lentes'></i>";
                    for( var x in $scope.tours ){
                        result += ( x>0?(x==$scope.tours.length-1?' y ':', '):'' ) + $scope.tours[x]._data.tour.name + ( $scope.hotels?'':(" el " + $scope.tours[x].startDate ) );
                    }
                    result += ".</span>";
                }else{
                    result += ($scope.hotels?'and ':'') + "I'm going to visit <span class='white'><i class='icon-lentes'></i>";
                    for( var x in $scope.tours ){
                        result += ( x>0?(x==$scope.tours.length-1?' and ':', '):'' ) + $scope.tours[x]._data.tour.name + ( $scope.hotels?'':(" on " + $scope.tours[x].startDate ) );
                    }
                    result += ".</span>";
                }
            }
            $scope.tourResume = $sce.trustAsHtml(result);
        };
        var getTransferResume = function(){
            var result = '';
            //console.log('transfers');console.log($scope.transfers);
            if( $scope.transfers.length ){
                if( $rootScope.lang_ == 'es' ){
                    moment.locale( $rootScope.lang_ );
                    var aux = ' Deseo que me recojan el día <span class="text-green"><i class="icon-calendar"></i> ';
                    for( var x=0;x < $scope.transfers.length;x++ ){
                        var data = $scope.transfers[x]._data;
                        var item = $scope.transfers[x];
                        //console.log('resume' + x);console.log(data);
                        if( data.type == 'round_trip' ){
                            if( data.origin.handle == 'hotel' ){
                                var initend = { initplace : data.hotel , initdate : moment(item.departure_date , 'D/M/YYYY' ) , endplace : data.airport , enddate : moment(item.arrival_date , 'D/M/YYYY' ) };
                            }else{
                                var initend = { initplace : data.airport , initdate : moment(item.arrival_date , 'D/M/YYYY' ) , endplace : data.hotel, enddate : moment(item.departure_date , 'D/M/YYYY' ) };
                            }
                            //console.log(initend);
                            result += aux + initend.initdate.format('dddd') + ', ' + initend.initdate.format('D/MMMM/YYYY') + "</span> y me lleven <i class='icon-car2'></i> desde el ";
                            result += initend.initplace.name + " hacia el " + initend.endplace.name + ", y luego, el día <span><i class='icon-calendar'></i>";
                            //
                            result += initend.enddate.format('dddd') + ', ' + initend.enddate.format('D/MMMM/YYYY') + "</span> me lleven <i class='icon-car2'></i> desde el ";
                            result += initend.endplace.name + " hacia el " + initend.initplace.name;
                        }else{
                            if( data.origin.handle == 'hotel' ){
                                var initend = { initplace : data.hotel , initdate : moment(item.departure_date , 'D/M/YYYY' ) , endplace : data.airport };
                            }else{
                                var initend = { initplace : data.airport , initdate : moment(item.arrival_date , 'D/M/YYYY' ) , endplace : data.hotel };
                            }
                            result += aux + initend.initdate.format('dddd') + ', ' + initend.initdate.format('D/MMMM/YYYY') + "</span> y me lleven <i class='icon-car2'></i> desde el ";
                            result += initend.initplace.name + " hacia el " + initend.endplace.name;
                        }
                        aux = '; y también el día <span class="text-green"><i class="icon-calendar"></i> ';
                    }
                    result += ".";
                }else{
                    //
                }
            }
            $scope.transferResume = $sce.trustAsHtml(result)
        };
        formatCart();
        getHotelResume();
        getTourResume();
        getTransferResume();
        $rootScope.$on('ngCart:change', function(){
            $scope.hotels = false;
            $scope.tours = [];
            $scope.transfers = [];
            formatCart();
            getHotelResume();
            getTourResume();
            getTransferResume();
        });
        $rootScope.$on('ngCart:itemAdded', function(){
            console.log($('#footer .above .openFooter'));
            if($('#footer .above .openFooter').hasClass('closed'))
                $('#footer .above .openFooter').click();
                //console.log('hasClass!!!!!!!!!!!!!!!!!!!!!');
        });
    };
    controllerCartResume.$inject = ['$scope','$http','ngCart','$sce','$rootScope'];
    var directivecartResume = function(){
        return {
            controller : controllerCartResume,
            restrict : 'A',
            scope : {
                data:'='
            },
            templateUrl : "/templates/partials/cartResume.html",
        };
    };
    app.directive('cartResume',directivecartResume);
    /* cartRecommendation directive */
    /* Obtiene los elementos del carrito y hace recomendaciones dependiendo de lo seleecionado
    ** No necesitaría parámetros
    */
    var controllercartRecommendation = function($scope,$http,ngCart,$compile,$rootScope){
        $scope.ngCart = ngCart;
        $scope.recommend = false;
        $scope.recommendArray = { hotels : [] , tours : [] , transfers : [] };
        var formatCart = function(){
            if( $scope.ngCart.totalItems() > 0 ){
                $scope.tours_ = { tours : [] , locations : [] };
                $scope.hotels_ = { hotels : [] , locations : [] };
                $scope.transfers = [];
                //$scope.recommend = true;
                $scope.hotelsComplete = [];
                var items = ngCart.getCart().items;
                console.log(items);
                var hc = 0;
                items.forEach(function(item){
                    if( item.getData().reservation_type == 'hotel' ){
                        $scope.hotelsComplete.push(item._data.hotel);
                        $scope.hotels_.hotels.push(item._data.hotel.id);
                        $scope.hotels_.locations.push(item._data.hotel.location);
                        $scope.tours_.locations.push(item._data.hotel.location);
                    }else if( item.getData().reservation_type == 'tour' ){
                        $scope.tours_.tours.push(item._data.tour.id);
                        $scope.tours_.locations.push(item._data.tour.location);
                        $scope.hotels_.locations.push(item._data.tour.location);
                        //$scope.tours.push(item._data.tour);
                        //$scope.tours.push({id:item._data.tour.id,location:item._data.tour.location});
                    }else if( item.getData().reservation_type == 'transfer' ){
                        $scope.transfers.push(item);
                    }
                });
            }
        };
        $scope.openCreateForm = function(type,itemval,index){
            //var item = $( ".recommendations .table tr[data-id='"+type+"-"+tour.id+"']" );
            var item = $( "#"+type+"-"+itemval.id );
            //console.log(itemval);
            if( type=='t' && $('#tr-'+itemval.id).size()==0 ){
                $scope.dateOptions = { showWeeks: 'false' };
                $scope.newtour = {};
                $scope.newtour.tour = itemval;
                $scope.newtour.reservation_type = 'tour';
                $('tr.formReserve').remove();
                var formHTML = $("<tr ng-if='!inCart(recommendArray.tours["+index+"].id)' class='ligthgrayBG formReserve' id='tr-"+itemval.id+"' ><td colspan='4'><h3>Reservar tour</h3><form class='row-fluid' method='POST'><div class='row-fluid'> \
                    <div class='span6'><p>Fecha</p><div class='input-group'> \
                        <input type='text' ng-model='newtour.startDate' datepicker-popup='yyyy-MM-dd' is-open='open1' datepicker-options='dateOptions' > \
                        <span class='input-group-btn'><button ng-click='open($event,\"open1\")' type='button' class='calendario btn btn-default'><img class='small' alt='' src='/img/phone/book/calendario.png' /></div></div> \
                    <div class='span6'><div class='row-fluid'> \
                        <div class='span6'><p>Adultos</p><select chosen ng-model='newtour.adultNumber' disable-search='true' name='adultos' class='adultos' ng-options='val for val in getPaxArray(recommendArray.tours["+index+"],"+index+")'></select></div> \
                        <div class='span6'><p>Menores</p><select chosen ng-model='newtour.childrenNumber' disable-search='true' name='ninos' class='ninos' ng-options='val for val in getPaxArray(recommendArray.tours["+index+"],"+index+")'></select></div> \
                    </div></div> \
                </div><div class='row-fluid'> \
                    <div class='span12'><cart-button class='cart-button' quantity='newtour.adultNumber' id='{{recommendArray.tours["+index+"].id}}' name='{{recommendArray.tours["+index+"].name}}' price='recommendArray.tours["+index+"].fee' data='newtour' > Reservar <img alt='' src='/img/hoteles/tag.png' /></cart-button><a class='cancel btn' ng-click='deleteRow(\""+itemval.id+"\",\"t\")'>Cancelar</a></div> \
                </div></form></td></tr>");
            }else if( type == 'h' && $('#hr-'+itemval.id).size()==0 ){
                $scope.newhrev = {};
                $scope.newhrev.hotel = itemval;
                $scope.newhrev.reservation_type = 'hotel';
                $('tr.formReserve').remove();
                var formHTML = $("<tr ng-if='!inCart(recommendArray.hotels["+index+"].id)' class='ligthgrayBG formReserve' id='hr-"+itemval.id+"' ><td colspan='4'><h3>Reservar tour</h3><form class='row-fluid' method='POST'> \
                    <div class='row-fluid'> \
                        <div class='span6'><p>Fecha</p><div class='input-group'> \
                            <input type='text' ng-model='newhrev.startDate' datepicker-popup='yyyy-MM-dd' is-open='open1' datepicker-options='dateOptions' > \
                            <span class='input-group-btn'><button ng-click='open($event,\"open1\")' type='button' class='calendario btn btn-default'><img class='small' alt='' src='/img/phone/book/calendario.png' /> \
                        </div></div> \
                        <div class='span6'><p>Fecha</p><div class='input-group'> \
                            <input type='text' ng-model='newhrev.endDate' datepicker-popup='yyyy-MM-dd' is-open='open2' datepicker-options='dateOptions' > \
                            <span class='input-group-btn'><button ng-click='open($event,\"open2\")' type='button' class='calendario btn btn-default'><img class='small' alt='' src='/img/phone/book/calendario.png' /> \
                        </div></div> \
                    </div> \
                    <div class='row-fluid'> \
                        <div class='span6'><div class='row-fluid'> \
                            <div class='span6'><p>Habitaciones</p><select chosen ng-model='newhrev.roomType' disable-search='true' name='roomType' class='' ng-options='val as val.name_es for val in recommendArray.hotels["+index+"].rooms'></select></div> \
                            <div class='span6'><p>Número</p><select chosen ng-model='newhrev.roomsNumber' disable-search='true' name='roomsNumber' class='' ng-options='val for val in [1,2,3,4,5,6]'></select></div> \
                        </div></div> \
                        <div class='span6'><div class='row-fluid'> \
                            <div class='span6'><p>Adultos</p><select chosen ng-model='newhrev.adultNumber' disable-search='true' name='adultos' class='adultos' ng-options='val for val in getPaxArray(recommendArray.hotels["+index+"],"+index+")'></select></div> \
                            <div class='span6'><p>Menores</p><select chosen ng-model='newhrev.childrenNumber' disable-search='true' name='ninos' class='ninos' ng-options='val for val in getPaxArray(recommendArray.hotels["+index+"],"+index+")'></select></div> \
                        </div></div> \
                    </div> \
                <div class='row-fluid'> \
                    <div class='span12'><cart-button class='cart-button' quantity='newhrev.adultNumber' id='{{recommendArray.hotels["+index+"].id}}' name='{{recommendArray.hotels["+index+"].name}}' price='recommendArray.hotels["+index+"].price' data='newhrev' > Reservar <img alt='' src='/img/hoteles/tag.png' /></cart-button><a class='cancel btn' ng-click='deleteRow(\""+itemval.id+"\",\"h\")'>Cancelar</a></div> \
                </div></form></td></tr>");
            }else if( type == 'T' && $('#Tr-'+itemval.id).size()==0 ){
                $scope.newTrev = {};
                $scope.newTrev.hotel = $scope.hotelsComplete;
                $scope.newTrev.reservation_type = 'transfer';
                $scope.newTrev.airport = $scope.recommendArray.transfers.airport;
                $scope.newTrev.service = itemval.transfer;
                var aux = $scope.ngCart.getItemById($scope.hotelsComplete[0].id);
                $scope.newTrev.arrival_date = aux.startDate;
                $scope.newTrev.departure_date = aux.endDate;
                $scope.origins = [{ handle : 'airport', name : 'Aeropuerto' },{ handle : 'hotel', name : 'Hotel'}];
                $scope.hrs = [];
                $scope.mins = [];
                for(var k = 1;k<24;k++) $scope.hrs.push(k);
                for(var k = 1;k<60;k++) $scope.mins.push(k);
                $('tr.formReserve').remove();
                var name = $scope.hotelsComplete[0].name + ' - ' + $scope.recommendArray.transfers.airport.name + '(' + itemval.transfer.name + ')';
                var formHTML = $("<tr ng-if='!inCart(recommendArray.hotels["+index+"].id)' class='ligthgrayBG formReserve' id='Tr-"+itemval.id+"' ><td colspan='4'><h3>Reservar traslado ("+itemval.transfer.name+")</h3><form class='row-fluid' method='POST'> \
                    <div class='row-fluid'> \
                        <div class='span6'> \
                            <p>¿Dónde comienza?</p><p><select chosen ng-model='newTrev.origin' disable-search='true' name='roomType' class='' ng-options='val.handle as val.name for val in origins'></select></p>\
                        </div> \
                        <div class='span6'> \
                            <p>Vuelo de llegada</p><p><input ng-model='newTrev.arrival_fly' type='text' ></p> \
                        </div> \
                    </div> \
                    <div class='row-fluid'> \
                        <div class='span6'> \
                            <p>Personas</p><p><select chosen ng-model='newTrev.pax' disable-search='true' name='pax' class='' ng-options='val for val in [1,2,3,4,5,6]'></select></p>\
                        </div> \
                        <div class='span6'> \
                            <p>Vuelo de salida</p><p><input ng-model='newTrev.departure_fly' type='text' ></p> \
                        </div> \
                    </div> \
                    <div class='row-fluid'> \
                        <div class='span6'> \
                            <p>Hora de llegada</p> \
                            <div class='row-fluid'><div class='span6'><select chosen ng-model='newTrev.aTimeHr' disable-search='true' name='' class='' ng-options='t for t in hrs'></select></div> \
                                <div class='span6'><select chosen ng-model='newTrev.aTimeMin' disable-search='true' name='' class='' ng-options='t for t in mins'></select></div></div> \
                        </div> \
                        <div class='span6'> \
                            <p>Hora de salida</p> \
                            <div class='row-fluid'><div class='span6'><select chosen ng-model='newTrev.dTimeHr' disable-search='true' name='' class='' ng-options='t for t in hrs'></select></div> \
                                <div class='span6'><select chosen ng-model='newTrev.dTimeMin' disable-search='true' name='' class='' ng-options='t for t in mins'></select></div></div> \
                        </div> \
                    </div> \
                    <div class='row-fluid'> \
                        <div class='span6'> \
                            <p> </p><p><input type='radio' name='stype' ng-model='newTrev.type' value='one_way'> Sencillo</p>\
                        </div> \
                        <div class='span6'> \
                            <p> </p><p><input type='radio' name='stype' ng-model='newTrev.type' value='round_trip'> Redondo</p> \
                        </div> \
                    </div> \
                <div class='row-fluid'> \
                    <div class='span12'><cart-button class='cart-button' quantity='newTrev.pax' id='{{recommendArray.transfers.prices["+index+"].id}}' name='"+name+"' price='recommendArray.transfers.prices["+index+"][newTrev.type]' data='newTrev' > Reservar <img alt='' src='/img/hoteles/tag.png' /></cart-button><a class='cancel btn' ng-click='deleteRow(\""+itemval.id+"\",\"T\")'>Cancelar</a></div> \
                </div></form></td></tr>");
            }
            item.after(formHTML);
            $compile(formHTML)($scope);
        }
        $scope.deleteRow = function(itemval,type){
            //console.log('itemval');console.log(itemval);
            if( type!='' && $('#'+type+'r-'+itemval).size()>0 ){
                $('#'+type+'r-'+itemval).remove();
            }
            //if( type!='' && type=='t' && $('#tr-'+itemval).size()>0 ){ $('#tr-'+itemval).remove(); }
        }
        $scope.open = function($event,openVar) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope[openVar] = true;
        };
        $scope.getPaxArray = function(item,index){
            //console.log('item');console.log(item);console.log(index);
            var i, res = [];
            if( item.pax ){
                for (i = 1; i <= item.pax ; i++) res.push(i);
            }else{
                res.push(1);
            }
            return res;
        }
        $scope.getRecommendations = function(){
            //console.log('hotels array');console.log($scope.hotels_);
            if( $scope.hotels_.hotels.length==0 ) getRecHotel();
            /*console.log('------------------');
            console.log($scope.hotels_.hotels.length);
            console.log($scope.transfers.length);
            console.log('------------------');*/
            if( $scope.hotels_.hotels.length>0 && $scope.transfers.length==0 ) getRecTransfer();
            getRecTour();
        };
        var getRecTransfer = function(){
            console.log('the hotel');
            console.log($scope.hotelsComplete);
            $http.post('/reserva/getRecTransfer',{hotels:$scope.hotelsComplete},{}).success(function(result){
                $scope.recommendArray.transfers = result;
                console.log('transfers');console.log(result);
            });
        }
        var getRecHotel = function(){
            $http.post('/reserva/getRecHotel',$scope.hotels_,{}).success(function(result){
                $scope.recommendArray.hotels = result;
                console.log('hoteles');console.log(result);
            });
        };
        var getRecTour = function(){
            $http.post('/reserva/getRecTour',$scope.tours_,{}).success(function(result){
                $scope.recommendArray.tours = result;
                //console.log('tours');console.log(result);
            });
        };
        $scope.inCart = function(id){ return $scope.ngCart.getItemById(id); }
        formatCart();
        $scope.getRecommendations();
        $rootScope.$on('ngCart:change', function(){
            formatCart();
            $scope.getRecommendations();
        });
    };
    controllercartRecommendation.$inject = ['$scope','$http','ngCart','$compile','$rootScope'];
    var directivecartRecommendation = function(){
        return {
            controller : controllercartRecommendation,
            restrict : 'E',
            templateUrl : "/templates/partials/cartRecommendation.html",
        };
    };
    app.directive('cartRecommendation',directivecartRecommendation);
    //end of cart directives
}());