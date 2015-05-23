var DataTransform = require('../index.js').DataTransform,
	_ = require("underscore");

var data = {
	posts : [
		{
			title : "title1",
			description: "description1",
			blog: "This is a blog.",
			date: "11/4/2013",
			clearMe : "text to remove",
			extra : {
				link : "http://goo.cm"
			},
			list1:[
				{
					name:"mike"
				}
			],
			list2:[
				{
					item: "thing"
				}
			]
		}	
	]
};

var map = {
	list : 'posts',
	item: {
		name: "title",
		info: "description",
		text: "blog",
		date: "date",
		link: "extra.link",
		info: "list1.0.name"
	},
	operate: [
		{run: "Date.parse", on: "date"}
	]
};

describe("node-json-transform", function() {

    it("should extract values", function() {

		var dataTransform = DataTransform(data, map);

		expect(dataTransform.getValue(data, "posts.0.title")).toEqual("title1");

    });

    it("should transform data", function() {

    	var dataTransform = DataTransform(data, map);

		expect(dataTransform.transform()).toEqual([{
			name : "title1",
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
			name : "title1",
			info: "description1",
			text: "This is a blog.",
			date: 1383544800000,
			link: "http://goo.cm",
			info: "mike",
			clearMe: ""
		}]);

    });    

    it("should allow you to set fields", function() {

    	// Add a map item to  clear out the "clearMe" field.
    	var newMap = _.clone(map);
    	newMap.item = _.clone(map.item);
    	newMap.item.fieldThatDoesntExist = "";

    	var dataTransform = DataTransform(data, newMap);

		expect(dataTransform.transform()).toEqual([{
			name : "title1",
			info: "description1",
			text: "This is a blog.",
			date: 1383544800000,
			link: "http://goo.cm",
			info: "mike",
			fieldThatDoesntExist: ""
		}]);

    });   

});
