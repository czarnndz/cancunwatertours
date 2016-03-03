module.exports.view = function(view,data,req){
	data = data || {};
	data.page = data.page || {};
	data._content = sails.config.content;
	view(data);
};

module.exports.formatTours = function(tours,lang){
  if (_.isUndefined(tours) || _.isEmpty(tours)) return [];
	for(var i=0;i<tours.length;i++) tours[i] = Common.formatTour(tours[i],lang);
	return tours;
}
module.exports.formatTour = function(tour,lang){
	if(tour){
        tour.avatar = tour.icon ? process.env.BACKEND_URL +'/uploads/tours/'+tour.icon.filename : '/images/default.png';
        tour.avatar1  = tour.icon ? process.env.BACKEND_URL + '/uploads/tours/196x140'+tour.icon.filename : '/images/default.png';
        tour.avatar2 = tour.icon ? process.env.BACKEND_URL +'/uploads/tours/177x171'+tour.icon.filename : '/images/default.png';
        tour.avatar3 = tour.icon ? process.env.BACKEND_URL +'/uploads/tours/593x331'+tour.icon.filename : '/images/default.png';
        tour.reservation_type = 'tour';
        tour.adults = 1;
        tour.kids = 0;

        //if(tour.includes_es) tour.includes = tour.includes_es.split("\n");
        tour.name = tour.name_es;

        if (!lang)
            lang = 'en';
        if(tour['includes_'+lang]) tour.includes = tour['includes_'+lang].split("\n");
        else if(tour.tourincludes_es) tour.includes = tourincludes_es.split("\n");

        if(tour['description_'+lang]) tour.description = tour['description_'+lang].split("\n");
        else if(tour.description_es) tour.includes = tour.description_es.split("\n");

        if(tour['does_not_include_'+lang]) tour.noincludes = tour['does_not_include_'+lang].split("\n");
        else if(tour.does_not_include_es) tour.noincludes = tour.does_not_include_es.split("\n");

        if(tour['recommendations_'+lang]) tour.recommendations = tour['recommendations_'+lang].split("\n");
        else if(tour.recommendations_es) tour.recommendations = tour.recommendations_es.split("\n");

        return tour;
	} else
		return false;
}
module.exports.formatHotels = function(hotels,lang){
  if (_.isUndefined(hotels) || _.isEmpty(hotels)) return [];
  for(var i=0;i<hotels.length;i++) hotels[i] = Common.formatHotel(hotels[i],lang);
	return hotels;
}
module.exports.formatHotel = function(hotel,lang){
	if(hotel){
		hotel.avatar  = hotel.icon ? process.env.BACKEND_URL+'/uploads/hotels/196x140'+hotel.icon.filename : '/img/small_default.jpg';
		hotel.avatar2 = hotel.icon ? process.env.BACKEND_URL+'/uploads/hotels/177x171'+hotel.icon.filename : '/img/small_default.jpg';
		hotel.avatar3 = hotel.icon ? process.env.BACKEND_URL+'/uploads/hotels/593x331'+hotel.icon.filename : '/img/bit_default.jpg';
		hotel.price = 10;
		hotel.reservation_type = 'hotel';
		hotel.lang = lang;
		//hotel.description = hotel.description_es.replace("\n" , '</p><p>');
		if(hotel['description_'+lang]) hotel.description = hotel['description_'+lang].split("\n");
		if(hotel['services_'+lang]) hotel.services = hotel['services_'+lang].split("\n");
		if(hotel['payed_services_'+lang]) hotel.payed_services = hotel['payed_services_'+lang].split("\n");
		if(hotel.rooms){
			for(var i=0;i<hotel.rooms.length;i++) hotel.rooms[i] = Common.formatRoom( hotel.rooms[i] , lang );
		}
		return hotel;
	}else{
		return false;
	}
}

module.exports.formatRoom = function(room,lang){
    if(room){
        room.avatar  = room.icon ? sails.config.myconf.imagesURL+'/uploads/rooms/184x73'+room.icon.filename : '/img/small2_default.png';
        room.files = false;
        //if(room.services_es) room.services = room.services_es.split("\n");
        if(room['name_'+lang]) room.name = room['name_'+lang].split("\n");
        else room.name = room.name_es;

        if(room['description_'+lang]) room.description = room['description_'+lang].split("\n");
        else if(room.description_es) room.description = room.description_es.split("\n");

        if(room['services_'+lang]) room.services = room['services_'+lang].split("\n");
        else if(room.services_es) room.services = room.services_es.split("\n");

        if( room.views ){
            for(var j=0;j<room.views.length;j++){
                if(room.views[j]['name_'+lang]) room.views[j].name = room.views[j]['name_'+lang];
                //else room.views[j].name = room.views[j].name;
            }
        }
        return room;
    }else{
        return false;
    }
}

var Cache = require('sailsjs-cacheman').sailsCacheman('name');

module.exports.getTours = function(callback,params) {
  var s = {};
  var query = {};
  var sortBy = 'name';

  if(!params.pageSize) {
      params.pageSize = 15;
  }
  if (!params.page) {
      params.page = 1;
  }
  if (params.all) {
      params.pageSize = params.ids.length;
      params.page = 1;
  }
  if (params.sort) {
      sortBy = params.sort;
  }
  if( params.name && params.name != '' ){
    if (params.lang && params.lang == 'en')
        query.name_en = "/.*" + params.name + ".*/";
    else
        query.name = "/.*" + params.name + ".*/";
  }
  if(params.minFee){
    query.fee = { '>' : params.minFee };
  }
  if (params.maxFee){
    query.fee = { '<' : params.maxFee };
  }
  if (params.ids) {
    query.id = params.ids;
  }
  query.visible = true;
  var sort = { };
  sort[sortBy] = 1;
  //console.log(query);
  var cacheQuery = _.clone(query);
  cacheQuery.sort = params.sort;
  cacheQuery.pageSize = params.pageSize;
  cacheQuery.page = params.page;
  cacheQuery.lang = params.lang ? params.lang : 'es';

  var cacheKey = '"' + JSON.stringify(cacheQuery) + '"';

  Cache.get(cacheKey,function(e,val){
      if (e) {
          console.log('error cache');
          callback(e,null);
      } else {
          if (!val) {
              Tour.find(query).sort(sort).limit(params.pageSize).skip((params.page - 1 ) * params.pageSize).populate('categories').populate('provider').exec(function(er,tours) {
                  Cache.set(cacheKey,Common.formatTours(tours,cacheQuery.lang),'1h',function(err,value) {
                      if (err) throw err;
                      callback(err,value);
                  });
              });
          } else
            callback(null,val);
      }
  });


}

module.exports.formValidate = function(form,validate){
    for(var i in form){
        if(validate.indexOf(i)==-1)
            delete form[i];
    }
    return form;
};

module.exports.stringReplaceChars = function(string){
  var replace_map = {"á" : 'a', "é" : 'e', "í" : 'i', "ó" : 'o', "ú" : 'u', "?" : '', "!" : '', "’" : '', "'" : '','/' : '+','ñ' : 'n','¿' : '','¡' : '','.' : '','°' : '','&' : '',',' : '','Â' : ''};
  string = string.toLowerCase().replace(/[áéíóú?!’'\/ñ¿¡.°&,Â]/g, function(match){
    return replace_map[match];
  }).replace(/\s+/g, '-');
  return string;
}
module.exports.setAllToursUrl = function(limit,skip,theCB){
  limit = limit || 100;
  skip = skip || 0;
  console.log(skip);
  Tour.find().limit(limit).skip(skip).exec(function(err,tours){
    if(err) return err;
    async.mapSeries( tours, function(tour,CB){
      tour.url = Common.stringReplaceChars( tour.url&&tour.url!=''?tour.url:tour.name );
      tour.save(CB);
    },theCB);
  });
}
