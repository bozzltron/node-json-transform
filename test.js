
var assert = require('assert'),
	DataTransform = require('../server/data-transform.js').DataTransform,
	DataMap = require('../server/map.json');

var data = {
	posts : [
		{
			title : "title1",
			description: "description1",
			blog: "This is a blog.",
			date: "11/4/2013",
			extra : {
				link : "http://goo.cm"
			},
			list1:[],
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
		item: "list1.0.name"
	},
	operate: [
		{run: "Date.parse", on: "date"}
	]
};

console.log("Begin testing DataTransform");

var dataTransform = DataTransform(data, map);

assert.deepEqual(dataTransform.getValue(data, "posts"), [{
	title : "title1",
	description: "description1",
	blog: "This is a blog.",
	date: "11/4/2013",
	extra : {
		link : "http://goo.cm"
	},
	list1:[],
	list2:[
		{
			item: "thing"
		}
	]
}], "getValue() is failing");

console.log('transform', dataTransform.transform());
assert.deepEqual(dataTransform.transform(), [{
	name : "title1",
	info: "description1",
	text: "This is a blog.",
	date: 1383544800000,
	link: "http://goo.cm",
	item: null
}], 'transform() is falling');

console.log("Finish testing DataTransform");
