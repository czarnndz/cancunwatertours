/**
* TourCategory.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
  	name : 'String'
  	,name_en : 'String'
  	,name_ru : 'String'
  	,name_pt : 'String'
  	,icon : 'String'
  	,tours : {
  		collection : 'tour'
  		,via: 'categories'
        ,dominant : true
  	}
    ,type : {
      type: 'String'
      ,enum : ['normal', 'rate']
      ,defaultsTo : 'normal'
      /* Aquí se pueden ir agregando las variantes de categorías que podemos ir agregando
       normal: categorías normales
       rate : categorías numéricas, barras
       */
    }
    ,rating : 'array'
    ,classification : {
      type : 'String'
      ,enum : [ 'aquatic', 'land' ]
    }
    ,url : 'string'
  }
};

