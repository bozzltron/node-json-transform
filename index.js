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
						keys[i] in value) {
						value = value[keys[i]];
					} else {
						return null;
					}
				}
			}
			
			return value;

		},

		setValue : function(obj, key, newValue) {

			if(typeof(obj) == "undefined") {
				return;
			}

			if(key == '' || key == undefined) {
				return;
			}

			if(key == "") {
				return;
			} 
			
			keys = key.split('.');
			var target = obj;
			for(var i = 0; i < keys.length; i++ ) {
				if(i == keys.length-1){
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

		transform : function() {

			var value = this.getValue(data, map.list),
			    normalized = {};
			if(value) {
				var list = this.getList();
				var normalized = map.item ? _.map(list, _.bind(this.iterator, this, map.item)) : list;
				normalized = _.bind(this.operate, this, normalized)();
				normalized = _.bind(this.nested, this, normalized)();
				normalized = this.each(normalized);
			}
		    return normalized;

		},

		operate: function(data) {

			if(map.operate) {
				_.each(map.operate, _.bind(function(method){
					data = _.map(data, _.bind(function(item){
						var fn;
						if( 'string' === typeof method.run ) {
							fn = eval( method.run );
						} else {
							fn = method.run;
						}
						this.setValue(item,method.on,fn(this.getValue(item,method.on)))
						return item;
					},this));
				},this));
			}
			return data;

		},

		nested: function (data) {
			if (map.nested) {
				_.each(map.nested, _.bind(function (nestDefinition) {
					data = _.map(data, _.bind(function (item) {
						var dataTransform = exports.DataTransform(item, nestDefinition);
						this.setValue(item, nestDefinition.list, dataTransform.transform());
						return item;
					}, this));
				}, this));
			}
			return data;
		},

		each: function(data){
			if( map.each ) {
				_.each(data, map.each);
			}  
			return data;
		},

		iterator : function(map, item) {

			var obj = {};

			//to support simple arrays with recursion
			if(typeof(map) == "string") {
				return this.getValue(item, map);
			}
			_.each(map, _.bind(function(oldkey, newkey) {
				if(typeof(oldkey) == "string" && oldkey.length > 0) {
					obj[newkey] = this.getValue(item, oldkey);
				} else if( _.isArray(oldkey) ) {
					array = _.map(oldkey, _.bind(function(item,map) {return this.iterator(map,item)}, this , item));//need to swap arguments for bind
					obj[newkey] = array;
				}  else if(typeof oldkey == 'object'){
					var bound = _.bind(this.iterator, this, oldkey,item)
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