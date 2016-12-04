var DataTransform = require('../index.js').DataTransform,
	_ = require("underscore");

let map = {
	list: 'items',
	item: {
		id: 'id',
		sku: 'sku',
		toReplace: 'sku',
		errorReplace: 'notFound',
		simpleArray: ['id', 'sku','sku'],
		complexArray: [{node: 'id'},{otherNode:'sku'},{toReplace:'sku'}],
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
		run: (val)=>'replacement',
		on: 'subObject.subSubObject.node1'
	},
	{
		run: (val)=>'replacement',
		on: 'errorReplace'
	},
	{
		run: (val)=>'replacement',
		on: 'toReplace'
	},
		{
		run: (val)=>'replacement',
		on: 'simpleArray.2'
	},
	{
		run: (val)=>'replacement',
		on: 'complexArray.2.toReplace'
	},]
};

let object ={
	items:[{
	id: 'books',
	sku:'10234-12312'
	}]
}

let dataTransform = new DataTransform(object, map);
let result = dataTransform.transform();

console.log(JSON.stringify(result, null, 4));
