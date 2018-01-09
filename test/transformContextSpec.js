var DataTransform = require('../src/index.js').DataTransform,
	_ = require("lodash");

var data = {
	posts: [{
		title: "title1"
	}]
};

var map = {
	list: 'posts',
	item: {
		greeting: "title"
	},
	operate: [{
		run: function customFn( item, context ){
			return context.intro + item;
		},
		on: "greeting"
	}]
};

var mapEach = {
	list: 'posts',
	item: {
		greeting: "title"
	},
	each: function eachFn( item, index, collection, context ){
		item.greeting = context.intro + item;
		return item;
	}
};

describe("node-json-transform", function() {

	it("should pass the context to operate.run", function() {

		var dataTransform = DataTransform(_.clone(data), map);

		var context = {
			intro: 'Hi '
		};

		expect(dataTransform.transform(context)).toEqual([{
			greeting: "Hi title1"
		}]);

	});

	it("should pass the context to each", function() {

    var dataTransform = DataTransform(_.clone(data), map);

    var context = {
      intro: 'Hi '
    };

    expect(dataTransform.transform(context)).toEqual([{
      greeting: "Hi title1"
    }]);

	});

});
