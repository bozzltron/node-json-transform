var transform = require('../index.js').transform,
	_ = require("lodash");

var data = [{
		id: 'books0',
		zero: 0,
		sku: '00234-12312',
		subitems: [
				{ subid: "0.0", subsku: "subskuvalue0.0" },
				{ subid: "0.1", subsku: "subskuvalue0.1" }
		]
}, {
		id: 'books1',
		zero: 1,
		sku: '10234-12312',
		subitems: [
				{ subid: "1.0", subsku: "subskuvalue1.0" },
				{ subid: "1.1", subsku: "subskuvalue1.1" }
		]
}];

var baseMap = {
	'item' : {
		'myid': 'id',
		'mysku': 'sku',
		'mysubitems': 'subitems'
	},
	operate: [
			{
					'run': function(ary) { 
						return transform(ary, nestedMap);
					}, 
					'on': 'mysubitems'
			}
	]
};

var nestedMap = {
	'item' : {
		'mysubid': 'subid',
		'mysubsku': 'subsku'
	}
};

var expected = [
	{
	    "myid": "books0",
	    "mysku": "00234-12312",
	    "mysubitems": [
	    	{ "mysubid": "0.0", "mysubsku": "subskuvalue0.0" }, 
	    	{ "mysubid": "0.1", "mysubsku": "subskuvalue0.1"}
	    ]
	}, 
	{
	    "myid": "books1",
	    "mysku": "10234-12312",
	    "mysubitems": [
	    	{ "mysubid": "1.0", "mysubsku": "subskuvalue1.0" }, 
	    	{ "mysubid": "1.1", "mysubsku": "subskuvalue1.1" }
	    ]
	}
];


describe("node-json-transform", function() {

	it("should copy arrays", function() {
		expect(transform(data, baseMap)).toEqual(expected);
	});

});

