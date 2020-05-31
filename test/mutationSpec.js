var transform = require('../index.js').transform,
	_ = require("lodash");

var data = [{
	title: "title1"
}];

var map = {
	item: {
		name: "title",
	}
};


describe("node-json-transform", function() {

	it("should not manipulate the raw data", function() {

		var clone = _.clone(data);

		transform(data, map);

		expect(clone).toEqual(data);

	});

	it("should not manipulate the raw data", function() {

		var clone = _.clone(map);

		transform(data, map);

		expect(clone).toEqual(map);

	});

});