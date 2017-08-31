# node-data-transform

## Usage

### Basic Example

```javascript
var DataTransform = require("node-json-transform").DataTransform,
```

First we need some data.

```javascript
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
			list1:[
				{
					name:"mike"
				}
			],
			list2:[
				{
					item: "thing"
				}
			],
			clearMe: "text"
		}
	]
};
```

The map defines how the output will be structured and which operations to run.

```javascript
var map = {
	list : 'posts',
	item: {
		name: "title",
		info: "description",
		text: "blog",
		date: "date",
		link: "extra.link",
		item: "list1.0.name",
		clearMe: "",
		fieldGroup: ['title', 'extra']
	},
	operate: [
		{
			run: "Date.parse", on: "date"
		},
		{
			run: function(val) { return val + " more info"}, on: "info"
		}
	],
	each: function(item){
		// make changes
		item.iterated = true;
		return item;
	}
}
};
```
You can read this as follows:
- Get the array of objects in "posts".
- Map the name to title, info to description etc.
- Run Data.parse on the date value.
- Run each function on all items after mapping and operations.

Run it
```javascript
var dataTransform = DataTransform(data, map);
var result = dataTransform.transform();
console.log(result);
```

The expected output.
```javascript
[
	{
		name : "title1",
		info: "description1",
		text: "This is a blog.",
		date: 1383544800000,
		link: "http://goo.cm",
		info: "mike more info",
		clearMe: "",
		fieldGroup: ['title1', { link : "http://goo.cm" }],
		iterated: true
	}
]
```


### Advanced Example

```
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
	operate: [
		{
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
		}
	]
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

var result = DataTransform(data, map).transform();
```

The expected output.
```
[
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
]
```

### Multi-template Example

```
var data = {
    products: [{
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
    }]
};

var baseMap = {
	'list': 'products',
	'item' : {
		'myid': 'id',
		'mysku': 'sku',
		'mysubitems': 'subitems'
	},
    operate: [
        {
            'run': function(ary) { 
            	return DataTransform({list:ary}, nestedMap).transform();
            }, 
            'on': 'mysubitems'
        }
    ]
};

var nestedMap = {
	'list': 'list',
	'item' : {
		'mysubid': 'subid',
		'mysubsku': 'subsku'
	}
};

var result = DataTransform(data, baseMap).transform();
```

The expected output.

```
[
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
]
```

Enjoy!

## Changelog
1.0.13 Update code examples.
1.0.12 Fixed readme formatting.
1.0.11 Adding support for next object and nested array references.
1.0.10 Make each compatible with other options.
1.0.9  Updated the changelog.
1.0.8  Added each functionality to the map.
1.0.7  Updated Readme for multiple operations.
1.0.6  Accepted pull request form ooskapenaar.   You can now use custom functions as operators.
1.0.5  Accepted pull request from jaymedavis.  You can now pass an array directly and leave 'list' undefined.  
1.0.4  Added the ability to group fields into arrays  
1.0.3  Added the ability to clear and set field by passing an empty string in the map.  

## Credits

  - [Michael Bosworth](http://github.com/bozzltron)

## License

(The MIT License)

Copyright (c) 2014 Michael Bosworth

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
