var DataTransform = require('../index.js').DataTransform,
	_ = require("underscore");

let map = {
	list: 'items',
	item: {
		id: 'id',
		sku: 'sku',
		zero: 'zero',
		toReplace: 'sku',
		errorReplace: 'notFound',
		simpleArray: ['id', 'sku', 'sku'],
		complexArray: [{
			node: 'id'
		}, {
			otherNode: 'sku'
		}, {
			toReplace: 'sku'
		}],
		subObject: {
			node1: 'id',
			node2: 'sku',
			subSubObject: {
				node1: 'id',
				node2: 'sku',
			}
		},
		others: 'duplicates',
		deeplyNested: {
			list: 'deep.duplicates'
		},
		nest: 'nested'
	},
	nested: [{
		list: 'others',
		item: {
			newSKU: 'sku',
			newID: 'id'
		}

	}, {
		list: 'deeplyNested.list',
		item: {
			newSKU: 'sku',
			newID: 'id'
		}
	}, {
		list: 'nest',
		item: {
			skus: 'skus',
			newID: 'id'
		},
		nested: [{
			list: 'skus',
			item: {
				alternateSKU: 'subSKU',
			}
		}]
	},
	{
		list: 'others',
		item: {
			newSKU: 'sku',
			newID: 'id'
		}

	}]
};

let object = {
	items: [{
		id: 'books',
		zero: 0,
		sku: '10234-12312',
		duplicates: [{
			id: 'otherBook',
			sku: '10234-12313'
		}, {
			id: 'thirdBook',
			sku: '10234-12314'
		}],
		deep: {
			duplicates: [{
				id: 'otherBook',
				sku: '10234-12313'
			}, {
				id: 'thirdBook',
				sku: '10234-12314'
			}]
		},
		nested: [{
			id: 'otherBook',
			skus: [{
				subSKU: '1023'
			}]
		}, {
			id: 'thirdBook',
			skus: [{
				subSKU: '1024'
			},
			{
				subSKU: '1023'
			}]
		}]
	}]
}

let dataTransform = new DataTransform(object, map);
let result = dataTransform.transform();

console.log(JSON.stringify(result, null, 4));