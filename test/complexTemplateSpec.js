var DataTransform = require('../index.js').DataTransform,
	_ = require("lodash");

var map = {
	list: 'items',
	item: {
		id: 'id',
		sku: 'sku',
		zero: 'zero',
		toReplace: 'sku',
		errorReplace: 'notFound',
		simpleArray: ['id', 'sku','sku'],
		complexArray: [ {node: 'id'} , { otherNode:'sku' } , {toReplace:'sku'} ],
		subObject: {
			node1: 'id',
			node2: 'sku',
			subSubObject: {
				node1: 'id',
				node2: 'sku',
			}
		}
	},
	operate: [{
		run: (val) => 'replacement',
		on: 'subObject.subSubObject.node1'
	},
	{
		run: (val) => 'replacement',
		on: 'errorReplace'
	},
	{
		run: (val) => 'replacement',
		on: 'toReplace'
	},
		{
		run: (val) => 'replacement',
		on: 'simpleArray.2'
	},
	{
		run: (val) => 'replacement',
		on: 'complexArray.2.toReplace'
	},]
};

var object = {
	items:[
		{
			id: 'books',
			zero: 0,
			sku:'10234-12312'
		}
	]
};

describe("node-json-transform", function() {

	it("should extract values", function() {

		var expected = [
		    {
		        "id": "books",
		        "sku": "10234-12312",
		        "zero": 0,
		        "toReplace": "replacement",
		        "errorReplace": "replacement",
		        "simpleArray": [
		            "books",
		            "10234-12312",
		            "replacement"
		        ],
		        "complexArray": [
		            {
		                "node": "books"
		            },
		            {
		                "otherNode": "10234-12312"
		            },
		            {
		                "toReplace": "replacement"
		            }
		        ],
		        "subObject": {
		            "node1": "books",
		            "node2": "10234-12312",
		            "subSubObject": {
		                "node1": "replacement",
		                "node2": "10234-12312"
		            }
		        }
		    }
		];

		var dataTransform = new DataTransform(object, map);
		var result = dataTransform.transform();

		expect(result).toEqual(expected);

	});

});