var DataTransform = require('../index.js').DataTransform,
	_ = require("lodash");

var data = {
	posts: [{
		title: "title1"
	}]
};

var map = {
	list: 'posts',
	item: {
		name: "title",
	}
};


describe("node-json-transform", function() {

	it("should not manipulate the raw data", function() {

		var clone = _.clone(data);

		var dataTransform = DataTransform(data, map);
		dataTransform.transform();

		expect(clone).toEqual(data);

	});

	it("should not manipulate the raw data", function() {

		var clone = _.clone(map);

		var dataTransform = DataTransform(data, map);
		dataTransform.transform();

		expect(clone).toEqual(map);

	});

});