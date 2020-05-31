var DataTransform = require('../index.js').DataTransform,
	transform = require('../index.js').transform,
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

	it("should pass the context to each via functional api", function() {

    var context = {
      intro: 'Hi '
    };

    expect(transform(_.clone(data), map, context)).toEqual([{
      greeting: "Hi title1"
    }]);

	});

});
