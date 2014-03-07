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
          "self": {"href": "http://hellomean.com/kiosk/topic/1"},
          "slide": {"href": "http://hellomean.com/kiosk/topic/1/slide"} 
        }, 
        "title": "Stocks"
      },
      {
        "_links": {
          "self": {"href": "http://hellomean.com/kiosk/topic/2"},
          "slide": {"href": "http://hellomean.com/kiosk/topic/2/slide"} 
        },
        "title": "Weather"
      },
      {
        "_links": {
          "self": {"href": "http://hellomean.com/kiosk/topic/3"},
          "slide": {"href": "http://hellomean.com/kiosk/topic/3/slide"} 
        },
        "title": "Sports"
      },
      {
        "_links": {
          "self": {"href": "http://hellomean.com/kiosk/topic/4"},
          "slide": {"href": "http://hellomean.com/kiosk/topic/4/slide"} 
        },
        "title": "Food"
      },
      {
        "_links": {
          "self": {"href": "http://hellomean.com/kiosk/topic/5"},
          "slide": {"href": "http://hellomean.com/kiosk/topic/5/slide"} 
        },
        "title": "Finance"
      }
    ]
  }
};

window.fixtures.slideResponse = {
  topic1: {
    "_links": {
      "self": {"href": "http://hellomean.com/kiosk/topic/1/slide"}
    },
    "_embedded": {
      "slide": [
        {
          "_links": {
            "self": {"href": "http://hellomean.com/kiosk/slide/1"},
            "topic": {"href": "http://hellomean.com/kiosk/topic/1"}
          },
          "content": "<img alt='stocks' src='http://1.bp.blogspot.com/-xi9BdsGwlk0/Uj2-j3vYvUI/AAAAAAAAAhA/lvDPLE6DM5A/s1600/stock-chart-blue.png' />"
       }
      ]
    }
  }
};

