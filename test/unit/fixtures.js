window.fixtures = {};

window.fixtures.rootResponse = {
  "_links": {
    "self": {"href": "http://hellomean.com/kiosk"},
    "topic": {"href": "http://hellomean.com/kiosk/topic"}
  }
};

window.fixtures.topicResponse = {       
  "_links": {        
    "self": {"href": "http://hellomean.com/kiosk/topic"}, 
    "next": {"href": "http://hellomean.com/kiosk/topic?page=2"},
    "last": {"href": "http://hellomean.com/kiosk/topic?page=2"}
  },
  "count": 10,      
  "page": 1,
  "per_page": 5, 
  "_embedded": {       
    "topic": [
      {
        "_links": { 
          "self": {"href": "http://hellomean.com/kiosk/topic/1"} 
        }, 
        "title": "Stocks"
      },
      {
        "_links": {
          "self": {"href": "http://hellomean.com/kiosk/topic/2"}
        },
        "title": "Weather"
      },
      {
        "_links": {
          "self": {"href": "http://hellomean.com/kiosk/topic/3"}
        },
        "title": "Sports"
      },
      {
        "_links": {
          "self": {"href": "http://hellomean.com/kiosk/topic/4"}
        },
        "title": "Food"
      },
      {
        "_links": {
          "self": {"href": "http://hellomean.com/kiosk/topic/5"}
        },
        "title": "Finance"
      }
    ]
  }
};

