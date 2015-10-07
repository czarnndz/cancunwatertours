module.exports.view = function(view,data,req){
	data = data || {};
	data.page = data.page || {};
	data._content = sails.config.content;
	view(data);
};

module.exports.formatTours = function(tours,lang){
	for(var i=0;i<tours.length;i++) tours[i] = Common.formatTour(tours[i],lang);
	return tours;
}
module.exports.formatTour = function(tour,lang){
	if(tour){
        tour.avatar1  = tour.icon ? process.env.BACKEND_URL + '/uploads/tours/196x140'+tour.icon.filename : '/images/small_default.jpg';
        tour.avatar2 = tour.icon ? process.env.BACKEND_URL +'/uploads/tours/177x171'+tour.icon.filename : '/images/small_default.jpg';
        tour.avatar3 = tour.icon ? process.env.BACKEND_URL +'/uploads/tours/593x331'+tour.icon.filename : '/images/bit_default.jpg';
        tour.reservation_type = 'tour';

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
	}else
		return false;
}
module.exports.formatHotels = function(hotels,lang){
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