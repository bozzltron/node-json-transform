# node-data-transform


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
			list1:[],
			list2:[
				{
					item: "thing"
				}
			]
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
		item: "list1.0.name"
	},
	operate: [
		{run: "Date.parse", on: "date"}
	]
};
```
You can read this as follows.
1. Get the array of objects in "posts"
2. Map the title to name, description to info etc.
3. Run Data.parse on the date value

The expected output.
```javascript
[{
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
}] 
```

Enjoy!