// DataTransform

var _ = require('lodash');

exports.DataTransform = function(data, map){

	return {

		getValue : function(obj, key) {

			if(typeof(obj) == "undefined") {
				return "";
			}

			if(key == '' || key == undefined) {
				return obj;
			}

			var value = obj || data,
				key = key || map.list,
				keys = null;
			if(key == "") {
				value = "";
			} else {
				keys = key.split('.');
				for(var i = 0; i < keys.length; i++ ) {
					if(typeof(value) !== "undefined" && 
						value[keys[i]]) {
						value = value[keys[i]];
					} else {
						return null;
					}
				}
			}
			
			return value;

		},

		getList: function(){
			return this.getValue(data, map.list);
		},

		transform : function() {

			var value = this.getValue(data, map.list),
			    normalized = {};
			if(value) {
				var list = this.getList();
				var normalized = map.item ? _.map(list, _.bind(this.iterator, this)) : list;
				normalized = this.operate(normalized);
				normalized = this.each(normalized);
			}
		    return normalized;

		},

		operate: function(data) {

			if(map.operate) {
				_.each(map.operate, function(method){
					data = _.map(data, function(item){
						var fn;
						if( 'string' === typeof method.run ) {
							fn = eval( method.run );
						} else {
							fn = method.run;
						}
						item[method.on] = fn(item[method.on]);
						return item;
					});
				});
			}
			return data;

		},

		each: function(data){
			if( map.each ) {
				_.each(data, map.each);
			}  
			return data;
		},

		iterator : function(item) {

			var obj = {};
			_.each(map.item, _.bind(function(oldkey, newkey) {
				if(typeof(oldkey) == "string" && oldkey.length > 0) {
					obj[newkey] = this.getValue(item, oldkey);
				} else if( _.isArray(oldkey) ) {
					
					var array = [];
					_.each(oldkey, _.bind(function(key){
						array.push(this.getValue(item, key));
					},this));
					obj[newkey] = array;
					
				} else {
					obj[newkey] = "";
				}	

			}, this));
			return obj;

		}

	};

};
