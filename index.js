// DataTransform

var _ = require('lodash');

var DataTransform = function(data, map){

	return {

		defaultOrNull: function(key) {
			return key && map.defaults ? map.defaults[key] : null;
		},

		getValue : function(obj, key, newKey) {

			if(typeof obj === 'undefined') {
				return;
			}

			if(key == '' || key == undefined) {
				return obj;
			}

			var value = obj || data;
			var keys = null;

			key = key || map.list;
			return key == '' ? '' :  _.get(value, key, this.defaultOrNull(newKey));
		},

		setValue : function(obj, key, newValue) {

			if(typeof obj === "undefined") {
				return;
			}

			if(key == '' || key == undefined) {
				return;
			}

			if(key == '') {
				return;
			} 
			
			var keys = key.split('.');
			var target = obj;
			for(var i = 0; i < keys.length; i++ ) {
				if(i === keys.length - 1) {
					target[keys[i]] = newValue;
					return;
				}
				if(keys[i] in target)
					target = target[keys[i]];
				else return;
			}
		},

		getList: function(){
			return this.getValue(data, map.list);
		},

		transform : function(context) {
			var useList = map.list != undefined;
			var value; 
			if (useList) { 
				value = this.getValue(data, map.list);
			} else if (_.isArray(data) && !useList) {
				value = data;
			} else if (_.isObject(data) && !useList) { 
				value = [data];
			}
			var normalized = [];
		
			if(!_.isEmpty(value)) {
				var list = useList ? this.getList() : value;
				normalized = map.item ? _.map(list, _.bind(this.iterator, this, map.item)) : list;
				normalized = _.bind(this.operate, this, normalized)(context);
				normalized = this.each(normalized, context);
				normalized = this.removeAll(normalized);
			}
			
			if(!useList && _.isObject(data) && !_.isArray(data)){
				return normalized[0];
			}

			return normalized;

		},

		transformAsync : function(context) {
			return new Promise(function(resolve, reject) {
				try {
					resolve(this.transform(context))
				} catch (err) {
					reject(err);
				}
			}.bind(this));
		},

		removeAll: function(data){
      if (_.isArray(map.remove)) {
        return _.each(data, this.remove)
      }
			return data;
		},

		remove: function(item){
			_.each(map.remove, function (key) {
				delete item[key];
			});
			return item;
		},

		operate: function(data, context) {

			if(map.operate) {
				_.each(map.operate, _.bind(function(method){
					data = _.map(data, _.bind(function(item){
						var fn;
						if( 'string' === typeof method.run ) {
							fn = eval( method.run );
						} else {
							fn = method.run;
						}
						this.setValue(item,method.on,fn(this.getValue(item,method.on), context));
						return item;
					},this));
				},this));
			}
			return data;

		},

		each: function(data, context){
			if( map.each ) {
				_.each(data, function (value, index, collection) {
					return map.each(value, index, collection, context);
				});
			}  
			return data;
		},

		iterator : function(map, item) {

			var obj = {};

			//to support simple arrays with recursion
			if(typeof map === 'string') {
				return this.getValue(item, map);
			}
			_.each(map, _.bind(function(oldkey, newkey) {
				if(typeof oldkey === 'string' && oldkey.length > 0) {
					obj[newkey] = this.getValue(item, oldkey, newkey);
				} else if( _.isArray(oldkey) ) {
					var array = _.map(oldkey, _.bind(function(item,map) {return this.iterator(map,item)}, this , item));//need to swap arguments for bind
					obj[newkey] = array;
				}  else if(typeof oldkey === 'object'){
					var bound = _.bind(this.iterator, this, oldkey,item);
					obj[newkey] = bound();
				}
				else {
					obj[newkey] = "";
				}	

			}, this));
			return obj;

		}

	};

};

exports.DataTransform = DataTransform;

exports.transform = function(data, map, context) {
	var dataTransform = new DataTransform(data, map)
	return dataTransform.transform(context);
}

exports.transformAsync = function(data, map, context) {
	var dataTransform = new DataTransform(data, map)
	return dataTransform.transformAsync(context);
}