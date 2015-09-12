// DataTransform

var _ = require('underscore');

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

		transform : function() {

			var value = this.getValue(data, map.list),
			    normalized = {};
			if(value) {
				var normalized = _.map(this.getValue(data, map.list), _.bind(this.iterator, this));
				normalized = this.operate(normalized);
			}
		    return normalized;

		},

		operate: function(data) {

			_.each(map.operate, function(method){
				data = _.map(data, function(item){
					var fn = eval(method.run);
					item[method.on] = fn(item[method.on]);
					return item;
				});
			});
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
