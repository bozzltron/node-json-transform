var DataTransform = require('../index.js').DataTransform,
	transform = require('../index.js').transform,
	_ = require("lodash");

var data = {
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

var map = {
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
  
var expected = {
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
		expect(transform(data, map)).toEqual(expected);
	});

});
