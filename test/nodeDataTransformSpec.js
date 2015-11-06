var DataTransform = require('../index.js').DataTransform,
	_ = require("underscore");

var data = {
	posts: [{
		title: "uppercase",
		description: "description1",
		blog: "This is a blog.",
		date: "11/4/2013",
		clearMe: "text to remove",
		extra: {
			link: "http://goo.cm"
		},
		list1: [{
			name: "mike"
		}],
		list2: [{
			item: "thing"
		}]
	}]
};

var map = {
	list: 'posts',
	item: {
		name: "title",
		info: "description",
		text: "blog",
		date: "date",
		link: "extra.link",
		info: "list1.0.name"
	},
	operate: [{
		run: "Date.parse",
		on: "date"
	},{
		run: function customFn( item ){
			if( 'string' === typeof item )
				return item.toUpperCase();
			return item.toString().toUpperCase();
		},
		on: "name"
	}]
};

describe("node-json-transform", function() {

	it("should extract values", function() {

		var dataTransform = DataTransform(data, map);

		expect(dataTransform.getValue(data, "posts.0.description")).toEqual("description1");

	});

	it("should transform data", function() {

		var dataTransform = DataTransform(data, map);

		expect(dataTransform.transform()).toEqual([{
			name: "UPPERCASE",
			info: "description1",
			text: "This is a blog.",
			date: 1383544800000,
			link: "http://goo.cm",
			info: "mike"
		}]);

	});

	it("should allow you to clear out fields", function() {

		// Add a map item to  clear out the "clearMe" field.
		var newMap = _.clone(map);
		newMap.item = _.clone(map.item);
		newMap.item.clearMe = "";

		var dataTransform = DataTransform(data, newMap);

		expect(dataTransform.transform()).toEqual([{
			name: "UPPERCASE",
			info: "description1",
			text: "This is a blog.",
			date: 1383544800000,
			link: "http://goo.cm",
			info: "mike",
			clearMe: ""
		}]);

	});

	it("should allow you to set constant values in new fields", function() {

		// Add a map item to set a new field that is filled with a const str value.
		var newMap = _.clone(map);
		newMap.item = _.clone(map.item);
		newMap.item.constantField = "{DEFAULT_STATUS}";

		var dataTransform = DataTransform(data, newMap);

		expect(dataTransform.transform()).toEqual([{
			name: "UPPERCASE",
			info: "description1",
			text: "This is a blog.",
			date: 1383544800000,
			link: "http://goo.cm",
			info: "mike",
			constantField: "DEFAULT_STATUS"
		}]);

	});

	it("should allow you to map arrays", function() {

		// reconfigure 'posts' to demonstrate a fieldgroup
		var newMap = {
			list: 'posts',
			item: {
				fieldGroup: ["title", "description", "blog", "extra"]
			}
		};

		var dataTransform = DataTransform(data, newMap);

		expect(dataTransform.transform()).toEqual([{
			fieldGroup: [
				"uppercase",
				"description1",
				"This is a blog.", {
					link: "http://goo.cm"
				}
			]
		}]);

	});

	it("should allow you to pass arrays without specifying a list", function() {

		// Add a map item to  clear out the "clearMe" field.
		var newMap = {
			item: {
				fieldGroup: ["title", "description", "blog", "extra"]
			}
		};

		var data = [{
			title: "uppercase",
			description: "description1",
			blog: "This is a blog.",
			date: "11/4/2013",
			clearMe: "text to remove",
			extra: {
				link: "http://goo.cm"
			},
			list1: [{
				name: "mike"
			}],
			list2: [{
				item: "thing"
			}]
		}];

		var dataTransform = DataTransform(data, newMap);

		expect(dataTransform.transform()).toEqual([{
			fieldGroup: [
				"uppercase",
				"description1",
				"This is a blog.", {
					link: "http://goo.cm"
				}
			]
		}]);

	});

});
