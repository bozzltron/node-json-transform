var DataTransform = require('../index.js').DataTransform,
	transform = require('../index.js').transform,
	_ = require("lodash");

var test1_data = {
    "name": "Sarvpriy",
    "users": [
      {
        id: "1",
        name: "arya",
        comments: [
          { 
            text: "user id 1 comment no 1",
            replies: [{
                title: "reply 1 to user id 1 comment no 1"
            }, {
                title: "reply 2 to user id 1 comment no 1"
            }]
          },
          { 
            text: "user id 1 comment no 2",
            replies: [{
                title: "reply 1 to user id 1 comment no 2"
            }, {
                title: "reply 2 to user id 1 comment no 2"
            }]
          }
        ]
      }, {
        id: "2",
        name: "john",
        comments: [
          { 
            text: "user id 2 comment no 1",
            replies: [{
                title: "reply 1 to user id 2 comment no 1"
            }, {
                title: "reply 2 to user id 2 comment no 1"
            }]
          },
          { 
            text: "user id 2 comment no 2",
            replies: [{
                title: "reply 1 to user id 2 comment no 2"
            }, {
                title: "reply 2 to user id 2 comment no 2"
            }]
          }
        ]
      }
    ]
};

var test1_map = {
    "item" : {
      "myname": "name",
      "myusers[users]": {
          "userid": "id",
          "comments[comments]": {
              "mytext": "text",
              "myreplies[replies]": {
                  "mytitle": "title"
              }
          }
      }
    }
  };
  
var test1_expected = {
	"myname":"Sarvpriy",
	"myusers": [{
		"userid":"1",
		"comments": [{
			"mytext":"user id 1 comment no 1",
			"myreplies": [{
				"mytitle":"reply 1 to user id 1 comment no 1"
			},{
				"mytitle":"reply 2 to user id 1 comment no 1"
			}]
		},{
			"mytext":"user id 1 comment no 2",
			"myreplies": [{
				"mytitle":"reply 1 to user id 1 comment no 2"
			},{
				"mytitle":"reply 2 to user id 1 comment no 2"
			}]
		}]
	},{
		"userid":"2",
		"comments": [{
			"mytext":"user id 2 comment no 1",
			"myreplies": [{
				"mytitle":"reply 1 to user id 2 comment no 1"
			},{
				"mytitle":"reply 2 to user id 2 comment no 1"
			}]
		},{
			"mytext":"user id 2 comment no 2",
			"myreplies": [{
				"mytitle":"reply 1 to user id 2 comment no 2"
			},{
				"mytitle":"reply 2 to user id 2 comment no 2"
			}]
		}]
	}]
};

describe("node-json-transform", function() {

	it("should change array keys and prefix the oldkeys with full srckey path", function() {
		expect(transform(test1_data, test1_map)).toEqual(test1_expected);
	});

});


var test2_data = {
    "to": [{
        "email": "sarvpriy.arya@gmail.com",
        "name": "Sarvpriy Arya"
    },{
        "email": "sarvpriy.arya@gmail.com",
        "name": "Sarvpriy Arya"
    }]
};

var test2_map = {
  "item": {
        "personalizations": [{
            "to[to]": {
                "email": "email"
            }
        }]
    }
};

var test2_expected = {"personalizations":[{"to":[{"email":"sarvpriy.arya@gmail.com"},{"email":"sarvpriy.arya@gmail.com"}]}]}

describe("node-json-transform", function() {

  it("should work when top level is not an array", function() {
    expect(transform(test2_data, test2_map)).toEqual(test2_expected);
  });

  it("should handle root object ex. { item: `payload`}", function() {
    expect(transform({"payload": test2_data}, { "item": "payload"})).toEqual(test2_data);
  });

});
