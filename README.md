# node-data-transform
A node module for transforming and performing operations on JSON.


## Installation
```javascript
npm install node-json-transform --save
```

### Get Started

```javascript
var transform = require("node-json-transform").transform;
// or
var { transform } = require("node-json-transform");

var result = transform({  
  text: "hello"
}, {
  item: {
    message: "text"
  }
});
// result { message: "hello" }
```

### Transform API
transform (data, map, context)
#### Parameters
|Parameter|Type|Required|Description
|---|---|---|---|
|data| Object, Array|true |The JSON data that you want to transform|
|map| Object|true|How you want to tranform it|
|context| Object | false |Context to bind to for each item transformation. |

#### Returns
Object or Array based on input.

#####Object
If an object is passed in, it will transform the object and return the resulting object. 

##### Array 
If an array is passed in, each item will be iterated, transformed, and the entire result will be returned.  If no "list" is passed map, it will used the data as is.

### Map Schema
```javascript
{
  list: "",                // Not required.  If there is a sub-attribute in the incoming data that you want to used for tranformation rather than the data itself, you can specify that here.  It must point to an array.
  item: {                  // Required. Defines object mapping.
    destination: "source"  // The destination is the attribute name where source data will be mapped to in the result.  The path uses lodash.get function to find a value in the incoming data.
  },
  remove:['attribute'],    // Not required. Specifies an attribute to be removed from each item.
  defaults: {}             // Not required.  Specifies fallback values for attributes if they are missing.
  operate:[                // Not required.  Runs after object mapping. Modifies the attribute specified in "on".
    {
      run: "",             // Specifices the name of a function to run
      on: ""               // Specifies the attribute to be passed into the function above as a parameter
    }
  ],
  each: function(item){    // Not required.  Runs after object mapping and operations.  Allows access to each item for manipulation.
    return item;
  }
}
```

### Common Example

First we need some data.

```javascript
var data = {
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
};
```

The map defines how the output will be structured and which operations to run.

```javascript
var map = {
  item: {
    name: "title",
    info: "description",
    text: "blog",
    date: "date",
    link: "extra.link",
    item: "list1.0.name",
    clearMe: "",
    fieldGroup: ["title", "extra"]
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
    item.iterated = true;
    return item; 
  }
};
```
You can read this as follows:
- Map the name to title, info to description etc.
- Run Data.parse on the date value.
- Run each function on all items after mapping and operations.

Run it synchronously
```javascript
var transform = require("node-json-transform").transform;
var result = transform(data, map);
console.log(result);
```
... or asynchronously
```javascript
var transform = require("node-json-transform").transformAsync;
transform(data, map).then((function(result){
  console.log(result);
});
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
    fieldGroup: ["title1", { link : "http://goo.cm" }],
    iterated: true
  }
]
```


### Advanced Example

```javascript
var map = {
  item: {
    id: "id",
    sku: "sku",
    zero: "zero",
    toReplace: "sku",
    errorReplace: "notFound",
    simpleArray: ["id", "sku","sku"],
    complexArray: [ {node: "id"} , { otherNode:"sku" } , {toReplace:"sku"} ],
    subObject: {
      node1: "id",
      node2: "sku",
      subSubObject: {
        node1: "id",
        node2: "sku",
      }
    },
  },
  remove: ["unwanted"],
  defaults: {
    "missingData": true
  },
  operate: [
    {
      run: (val) => "replacement",
      on: "subObject.subSubObject.node1"
    },
    {
      run: (val) => "replacement",
      on: "errorReplace"
    },
    {
      run: (val) => "replacement",
      on: "toReplace"
    },
      {
      run: (val) => "replacement",
      on: "simpleArray.2"
    },
    {
      run: (val) => "replacement",
      on: "complexArray.2.toReplace"
    }
  ]
};

var object = [
  {
    id: "books",
    zero: 0,
    sku:"10234-12312",
    unwanted: true
  }
];

var result = transform(data, map);
```

The expected output.
```javascript
[
  {
    id: "books",
    sku: "10234-12312",
    zero: 0,
    toReplace: "replacement",
    errorReplace: "replacement",
    simpleArray: [
      "books",
      "10234-12312",
      "replacement"
    ],
    complexArray: [
      {
        node: "books"
      },
      {
        otherNode: "10234-12312"
      },
      {
        toReplace: "replacement"
      }
    ],
    subObject: {
      node1: "books",
      node2: "10234-12312",
      subSubObject: {
        node1: "replacement",
        node2: "10234-12312"
      }
    },
    missingData: true
]
```

### Multi-template Example

```javascript
var data = [
  {
    id: "books0",
    zero: 0,
    sku: "00234-12312",
    subitems: [
      { subid: "0.0", subsku: "subskuvalue0.0" },
      { subid: "0.1", subsku: "subskuvalue0.1" }
    ]
  }, {
    id: "books1",
    zero: 1,
    sku: "10234-12312",
    subitems: [
      { subid: "1.0", subsku: "subskuvalue1.0" },
      { subid: "1.1", subsku: "subskuvalue1.1" }
    ]
  }
];

var baseMap = {
  item : {
    "myid": "id",
    "mysku": "sku",
    "mysubitems": "subitems"
  },
  operate: [
    {
      run: function(ary) { 
        return transform(ary, nestedMap);
      }, 
      on: "mysubitems"
    }
  ]
};

var nestedMap = {
  "item" : {
    "mysubid": "subid",
    "mysubsku": "subsku"
  }
};

var result = transform(data, baseMap);
```

The expected output.

```javascript
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

### Context Example

First we need some data.

```javascript
var data = [
  {
    title : "title1",
    description: "description1"
  }
];
```

The map defines how the output will be structured and which operations to run.

```javascript
var map = {
  item: {
    name: "title",
    info: "description"
  },
  operate: [
    {
      run: function(val, context) { return val + " more info for" + context.type},
      on: "info"
    }
  ],
  each: function(item, index, collection, context){
    item.type = context.type;
    return item;
  }
};
```

Run it
```javascript
var context = { type: "my-type" };
var result = transform(data, map, context);
console.log(result);
```

The expected output.
```javascript
[
  {
    name : "title1",
    info: "description1 more info for my-type",
    type: "my-type"
  }
]
```

Enjoy!

## Changelog
1.1.2 Security upgrade
1.1.1 Omit undefined keys from the results.  
1.1.0  New functional transform() interface.  Object support.  Updated documentation.  
1.0.21 Uses loadash _get() for source traversal  
1.0.20 Correct documentation  
1.0.19 Update examples  
1.0.18 Introducing transformAsync which returns a promise.  
1.0.17 Ensure transform always returns an array
1.0.16 ES5 compatibility  
1.0.15 Add support for a context object that is passed through to the operate.run and each functions.  
1.0.14 Add support for default values via "defaults" definition.  Add support for removing attributes via the "remove" definition.  
1.0.13 Update code examples.  
1.0.12 Fixed readme formatting.  
1.0.11 Adding support for next object and nested array references.  
1.0.10 Make each compatible with other options.  
1.0.9  Updated the changelog.  
1.0.8  Added each functionality to the map.  
1.0.7  Updated Readme for multiple operations.  
1.0.6  Accepted pull request form ooskapenaar.   You can now use custom functions as operators.  
1.0.5  Accepted pull request from jaymedavis.  You can now pass an array directly and leave "list" undefined.   
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
